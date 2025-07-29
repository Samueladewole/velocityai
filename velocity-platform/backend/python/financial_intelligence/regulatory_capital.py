"""
Regulatory Capital Calculation Engine for Basel III/IV Compliance
Implements advanced risk-weighted asset calculations and capital adequacy ratios
"""

from typing import Dict, List, Optional, Any, Union, Tuple
from datetime import datetime, timedelta
from decimal import Decimal, getcontext
from enum import Enum
import math
import numpy as np
import pandas as pd
import structlog
from pydantic import BaseModel, Field
from dataclasses import dataclass

# Set high precision for financial calculations
getcontext().prec = 28

logger = structlog.get_logger()

class AssetClass(str, Enum):
    """Basel asset classification"""
    SOVEREIGNS = "sovereigns"
    BANKS = "banks"
    CORPORATES = "corporates"
    RETAIL = "retail"
    EQUITY = "equity"
    SECURITIZATION = "securitization"
    OPERATIONAL_RISK = "operational_risk"
    MARKET_RISK = "market_risk"
    CREDIT_VALUATION_ADJUSTMENT = "cva"

class RiskType(str, Enum):
    """Types of regulatory risk"""
    CREDIT_RISK = "credit_risk"
    OPERATIONAL_RISK = "operational_risk"
    MARKET_RISK = "market_risk"
    COUNTERPARTY_CREDIT_RISK = "counterparty_credit_risk"
    SETTLEMENT_RISK = "settlement_risk"
    CONCENTRATION_RISK = "concentration_risk"

class RatingGrade(str, Enum):
    """Credit rating grades for risk weighting"""
    AAA_TO_AA_MINUS = "AAA_to_AA_minus"
    A_PLUS_TO_A_MINUS = "A_plus_to_A_minus"
    BBB_PLUS_TO_BBB_MINUS = "BBB_plus_to_BBB_minus"
    BB_PLUS_TO_B_MINUS = "BB_plus_to_B_minus"
    BELOW_B_MINUS = "below_B_minus"
    UNRATED = "unrated"

class CapitalTier(str, Enum):
    """Basel capital tiers"""
    CET1 = "cet1"  # Common Equity Tier 1
    AT1 = "at1"    # Additional Tier 1
    T2 = "t2"      # Tier 2
    TOTAL = "total"

@dataclass
class RiskWeight:
    """Risk weight configuration for different asset classes"""
    asset_class: AssetClass
    rating_grade: RatingGrade
    risk_weight: Decimal
    maturity_adjustment: Optional[Decimal] = None
    correlation_factor: Optional[Decimal] = None

class BaselConfiguration(BaseModel):
    """Basel III/IV configuration parameters"""
    framework_version: str = Field("Basel III", description="Basel framework version")
    jurisdiction: str = Field("EU", description="Regulatory jurisdiction")
    
    # Capital ratio requirements
    cet1_minimum: Decimal = Field(Decimal("0.045"), description="CET1 minimum ratio")
    tier1_minimum: Decimal = Field(Decimal("0.06"), description="Tier 1 minimum ratio")
    total_capital_minimum: Decimal = Field(Decimal("0.08"), description="Total capital minimum ratio")
    
    # Capital buffers
    capital_conservation_buffer: Decimal = Field(Decimal("0.025"), description="Capital conservation buffer")
    countercyclical_buffer: Decimal = Field(Decimal("0.0"), description="Countercyclical buffer")
    systemic_buffer: Decimal = Field(Decimal("0.0"), description="Systemic importance buffer")
    
    # Leverage ratio
    leverage_ratio_minimum: Decimal = Field(Decimal("0.03"), description="Leverage ratio minimum")
    
    # Liquidity ratios
    lcr_minimum: Decimal = Field(Decimal("1.0"), description="Liquidity Coverage Ratio minimum")
    nsfr_minimum: Decimal = Field(Decimal("1.0"), description="Net Stable Funding Ratio minimum")

class Exposure(BaseModel):
    """Financial exposure for capital calculation"""
    exposure_id: str
    counterparty_id: str
    asset_class: AssetClass
    exposure_amount: Decimal
    rating_grade: RatingGrade
    maturity_years: Optional[Decimal] = None
    collateral_amount: Decimal = Field(Decimal("0"))
    netting_agreement: bool = False
    probability_of_default: Optional[Decimal] = None
    loss_given_default: Optional[Decimal] = None
    exposure_at_default: Optional[Decimal] = None
    country_code: Optional[str] = None
    currency: str = "EUR"
    valuation_date: datetime = Field(default_factory=datetime.utcnow)

class CapitalComponents(BaseModel):
    """Bank capital components"""
    common_equity_tier1: Decimal = Field(Decimal("0"))
    additional_tier1: Decimal = Field(Decimal("0"))
    tier2_capital: Decimal = Field(Decimal("0"))
    regulatory_adjustments: Decimal = Field(Decimal("0"))
    
    @property
    def tier1_capital(self) -> Decimal:
        return self.common_equity_tier1 + self.additional_tier1
    
    @property
    def total_capital(self) -> Decimal:
        return self.tier1_capital + self.tier2_capital

class RiskWeightedAssets(BaseModel):
    """Risk-weighted assets calculation result"""
    credit_risk_rwa: Decimal = Field(Decimal("0"))
    operational_risk_rwa: Decimal = Field(Decimal("0"))
    market_risk_rwa: Decimal = Field(Decimal("0"))
    cva_risk_rwa: Decimal = Field(Decimal("0"))
    
    @property
    def total_rwa(self) -> Decimal:
        return (self.credit_risk_rwa + self.operational_risk_rwa + 
                self.market_risk_rwa + self.cva_risk_rwa)

class CapitalRatios(BaseModel):
    """Capital adequacy ratios"""
    cet1_ratio: Decimal
    tier1_ratio: Decimal
    total_capital_ratio: Decimal
    leverage_ratio: Decimal
    
    # Buffer ratios
    capital_conservation_buffer_ratio: Decimal = Field(Decimal("0"))
    countercyclical_buffer_ratio: Decimal = Field(Decimal("0"))
    
    # Compliance flags
    cet1_compliant: bool
    tier1_compliant: bool
    total_capital_compliant: bool
    leverage_compliant: bool

class RegulatorCapitalEngine:
    """
    Advanced regulatory capital calculation engine
    Implements Basel III/IV standardized and IRB approaches
    """
    
    def __init__(self, config: BaselConfiguration):
        self.config = config
        self.risk_weights = self._initialize_risk_weights()
        
    def _initialize_risk_weights(self) -> Dict[Tuple[AssetClass, RatingGrade], Decimal]:
        """Initialize Basel risk weight tables"""
        weights = {}
        
        # Sovereign risk weights (Table 1 - Basel III)
        sovereign_weights = {
            RatingGrade.AAA_TO_AA_MINUS: Decimal("0.0"),
            RatingGrade.A_PLUS_TO_A_MINUS: Decimal("0.20"),
            RatingGrade.BBB_PLUS_TO_BBB_MINUS: Decimal("0.50"),
            RatingGrade.BB_PLUS_TO_B_MINUS: Decimal("1.0"),
            RatingGrade.BELOW_B_MINUS: Decimal("1.50"),
            RatingGrade.UNRATED: Decimal("1.0")
        }
        
        for grade, weight in sovereign_weights.items():
            weights[(AssetClass.SOVEREIGNS, grade)] = weight
        
        # Bank risk weights (Table 2 - Basel III)
        bank_weights = {
            RatingGrade.AAA_TO_AA_MINUS: Decimal("0.20"),
            RatingGrade.A_PLUS_TO_A_MINUS: Decimal("0.50"),
            RatingGrade.BBB_PLUS_TO_BBB_MINUS: Decimal("0.50"),
            RatingGrade.BB_PLUS_TO_B_MINUS: Decimal("1.0"),
            RatingGrade.BELOW_B_MINUS: Decimal("1.50"),
            RatingGrade.UNRATED: Decimal("0.50")
        }
        
        for grade, weight in bank_weights.items():
            weights[(AssetClass.BANKS, grade)] = weight
        
        # Corporate risk weights (Table 3 - Basel III)
        corporate_weights = {
            RatingGrade.AAA_TO_AA_MINUS: Decimal("0.20"),
            RatingGrade.A_PLUS_TO_A_MINUS: Decimal("0.50"),
            RatingGrade.BBB_PLUS_TO_BBB_MINUS: Decimal("1.0"),
            RatingGrade.BB_PLUS_TO_B_MINUS: Decimal("1.0"),
            RatingGrade.BELOW_B_MINUS: Decimal("1.50"),
            RatingGrade.UNRATED: Decimal("1.0")
        }
        
        for grade, weight in corporate_weights.items():
            weights[(AssetClass.CORPORATES, grade)] = weight
        
        # Retail risk weights (fixed at 75% for qualifying retail)
        for grade in RatingGrade:
            weights[(AssetClass.RETAIL, grade)] = Decimal("0.75")
        
        # Equity risk weights (minimum 100% for banking book)
        for grade in RatingGrade:
            weights[(AssetClass.EQUITY, grade)] = Decimal("1.0")
        
        return weights
    
    def calculate_credit_risk_rwa(self, exposures: List[Exposure]) -> Decimal:
        """Calculate credit risk RWA using standardized approach"""
        total_rwa = Decimal("0")
        
        for exposure in exposures:
            # Get base risk weight
            risk_weight = self._get_risk_weight(exposure.asset_class, exposure.rating_grade)
            
            # Apply credit risk mitigation
            adjusted_exposure = self._apply_credit_risk_mitigation(exposure)
            
            # Calculate RWA for this exposure
            exposure_rwa = adjusted_exposure * risk_weight
            total_rwa += exposure_rwa
            
            logger.debug("Credit risk RWA calculated",
                        exposure_id=exposure.exposure_id,
                        asset_class=exposure.asset_class,
                        risk_weight=float(risk_weight),
                        exposure_amount=float(adjusted_exposure),
                        rwa=float(exposure_rwa))
        
        return total_rwa
    
    def calculate_operational_risk_rwa(
        self, 
        business_indicator: Decimal,
        internal_loss_multiplier: Decimal = Decimal("1.0")
    ) -> Decimal:
        """Calculate operational risk RWA using Standardized Measurement Approach (SMA)"""
        # Basel III SMA approach
        bi = business_indicator
        
        # Calculate Business Indicator Component (BIC)
        if bi <= Decimal("1000000000"):  # €1B threshold
            marginal_coefficient = Decimal("0.12")
            bic = bi * marginal_coefficient
        elif bi <= Decimal("30000000000"):  # €30B threshold
            base = Decimal("1000000000") * Decimal("0.12")
            excess = bi - Decimal("1000000000")
            marginal_coefficient = Decimal("0.15")
            bic = base + (excess * marginal_coefficient)
        else:  # Above €30B
            base1 = Decimal("1000000000") * Decimal("0.12")
            base2 = Decimal("29000000000") * Decimal("0.15")
            excess = bi - Decimal("30000000000")
            marginal_coefficient = Decimal("0.18")
            bic = base1 + base2 + (excess * marginal_coefficient)
        
        # Operational Risk Capital = BIC × ILM
        operational_risk_capital = bic * internal_loss_multiplier
        
        # Convert to RWA (multiply by 12.5)
        operational_risk_rwa = operational_risk_capital * Decimal("12.5")
        
        logger.info("Operational risk RWA calculated",
                   business_indicator=float(bi),
                   bic=float(bic),
                   ilm=float(internal_loss_multiplier),
                   operational_risk_capital=float(operational_risk_capital),
                   rwa=float(operational_risk_rwa))
        
        return operational_risk_rwa
    
    def calculate_market_risk_rwa(
        self,
        trading_book_positions: Dict[str, Decimal],
        var_estimates: Dict[str, Decimal]
    ) -> Decimal:
        """Calculate market risk RWA using Fundamental Review of Trading Book (FRTB)"""
        # Simplified FRTB sensitivities-based approach
        total_market_risk = Decimal("0")
        
        # Delta risk
        delta_risk = self._calculate_delta_risk(trading_book_positions)
        
        # Vega risk  
        vega_risk = self._calculate_vega_risk(var_estimates)
        
        # Curvature risk
        curvature_risk = self._calculate_curvature_risk(trading_book_positions)
        
        # Default risk to spread (DRC)
        drc_risk = self._calculate_drc_risk(trading_book_positions)
        
        total_market_risk = delta_risk + vega_risk + curvature_risk + drc_risk
        
        # Convert to RWA
        market_risk_rwa = total_market_risk * Decimal("12.5")
        
        logger.info("Market risk RWA calculated",
                   delta_risk=float(delta_risk),
                   vega_risk=float(vega_risk),
                   curvature_risk=float(curvature_risk),
                   drc_risk=float(drc_risk),
                   total_capital=float(total_market_risk),
                   rwa=float(market_risk_rwa))
        
        return market_risk_rwa
    
    def calculate_cva_risk_rwa(self, counterparty_exposures: List[Exposure]) -> Decimal:
        """Calculate Credit Valuation Adjustment (CVA) risk RWA"""
        total_cva_risk = Decimal("0")
        
        for exposure in counterparty_exposures:
            if exposure.asset_class == AssetClass.BANKS or exposure.asset_class == AssetClass.CORPORATES:
                # Simplified CVA calculation
                ead = exposure.exposure_at_default or exposure.exposure_amount
                lgd = exposure.loss_given_default or Decimal("0.45")  # 45% default LGD
                
                # CVA risk weight based on counterparty rating
                cva_risk_weight = self._get_cva_risk_weight(exposure.rating_grade)
                
                cva_risk = ead * lgd * cva_risk_weight
                total_cva_risk += cva_risk
        
        # Convert to RWA
        cva_rwa = total_cva_risk * Decimal("12.5")
        
        logger.info("CVA risk RWA calculated",
                   total_cva_risk=float(total_cva_risk),
                   rwa=float(cva_rwa))
        
        return cva_rwa
    
    def calculate_capital_ratios(
        self,
        capital_components: CapitalComponents,
        rwa: RiskWeightedAssets,
        total_exposure: Decimal
    ) -> CapitalRatios:
        """Calculate Basel capital adequacy ratios"""
        
        # Calculate ratios
        cet1_ratio = capital_components.common_equity_tier1 / rwa.total_rwa
        tier1_ratio = capital_components.tier1_capital / rwa.total_rwa
        total_capital_ratio = capital_components.total_capital / rwa.total_rwa
        leverage_ratio = capital_components.tier1_capital / total_exposure
        
        # Check compliance
        total_required_cet1 = (self.config.cet1_minimum + 
                              self.config.capital_conservation_buffer +
                              self.config.countercyclical_buffer +
                              self.config.systemic_buffer)
        
        cet1_compliant = cet1_ratio >= total_required_cet1
        tier1_compliant = tier1_ratio >= self.config.tier1_minimum
        total_capital_compliant = total_capital_ratio >= self.config.total_capital_minimum
        leverage_compliant = leverage_ratio >= self.config.leverage_ratio_minimum
        
        return CapitalRatios(
            cet1_ratio=cet1_ratio,
            tier1_ratio=tier1_ratio,
            total_capital_ratio=total_capital_ratio,
            leverage_ratio=leverage_ratio,
            capital_conservation_buffer_ratio=self.config.capital_conservation_buffer,
            countercyclical_buffer_ratio=self.config.countercyclical_buffer,
            cet1_compliant=cet1_compliant,
            tier1_compliant=tier1_compliant,
            total_capital_compliant=total_capital_compliant,
            leverage_compliant=leverage_compliant
        )
    
    def generate_capital_assessment_report(
        self,
        institution_id: str,
        capital_components: CapitalComponents,
        exposures: List[Exposure],
        business_indicator: Decimal,
        trading_book_positions: Dict[str, Decimal],
        var_estimates: Dict[str, Decimal],
        total_exposure: Decimal
    ) -> Dict[str, Any]:
        """Generate comprehensive capital assessment report"""
        
        # Calculate RWA components
        credit_rwa = self.calculate_credit_risk_rwa(exposures)
        operational_rwa = self.calculate_operational_risk_rwa(business_indicator)
        market_rwa = self.calculate_market_risk_rwa(trading_book_positions, var_estimates)
        cva_rwa = self.calculate_cva_risk_rwa(exposures)
        
        total_rwa = RiskWeightedAssets(
            credit_risk_rwa=credit_rwa,
            operational_risk_rwa=operational_rwa,
            market_risk_rwa=market_rwa,
            cva_risk_rwa=cva_rwa
        )
        
        # Calculate capital ratios
        ratios = self.calculate_capital_ratios(capital_components, total_rwa, total_exposure)
        
        # Generate report
        report = {
            "institution_id": institution_id,
            "assessment_date": datetime.utcnow().isoformat(),
            "framework": self.config.framework_version,
            "jurisdiction": self.config.jurisdiction,
            
            "capital_components": {
                "cet1_capital": float(capital_components.common_equity_tier1),
                "tier1_capital": float(capital_components.tier1_capital),
                "total_capital": float(capital_components.total_capital)
            },
            
            "risk_weighted_assets": {
                "credit_risk": float(total_rwa.credit_risk_rwa),
                "operational_risk": float(total_rwa.operational_risk_rwa),
                "market_risk": float(total_rwa.market_risk_rwa),
                "cva_risk": float(total_rwa.cva_risk_rwa),
                "total_rwa": float(total_rwa.total_rwa)
            },
            
            "capital_ratios": {
                "cet1_ratio": float(ratios.cet1_ratio),
                "tier1_ratio": float(ratios.tier1_ratio),
                "total_capital_ratio": float(ratios.total_capital_ratio),
                "leverage_ratio": float(ratios.leverage_ratio)
            },
            
            "regulatory_requirements": {
                "cet1_minimum": float(self.config.cet1_minimum),
                "tier1_minimum": float(self.config.tier1_minimum),
                "total_capital_minimum": float(self.config.total_capital_minimum),
                "leverage_minimum": float(self.config.leverage_ratio_minimum)
            },
            
            "compliance_status": {
                "cet1_compliant": ratios.cet1_compliant,
                "tier1_compliant": ratios.tier1_compliant,
                "total_capital_compliant": ratios.total_capital_compliant,
                "leverage_compliant": ratios.leverage_compliant,
                "overall_compliant": all([
                    ratios.cet1_compliant,
                    ratios.tier1_compliant,
                    ratios.total_capital_compliant,
                    ratios.leverage_compliant
                ])
            },
            
            "risk_profile": {
                "total_exposures": len(exposures),
                "exposure_concentration": self._calculate_concentration_metrics(exposures),
                "average_risk_weight": float(total_rwa.total_rwa / sum(e.exposure_amount for e in exposures))
            }
        }
        
        logger.info("Capital assessment report generated",
                   institution_id=institution_id,
                   total_rwa=float(total_rwa.total_rwa),
                   cet1_ratio=float(ratios.cet1_ratio),
                   overall_compliant=report["compliance_status"]["overall_compliant"])
        
        return report
    
    def _get_risk_weight(self, asset_class: AssetClass, rating_grade: RatingGrade) -> Decimal:
        """Get risk weight for asset class and rating"""
        return self.risk_weights.get((asset_class, rating_grade), Decimal("1.0"))
    
    def _apply_credit_risk_mitigation(self, exposure: Exposure) -> Decimal:
        """Apply credit risk mitigation techniques"""
        adjusted_exposure = exposure.exposure_amount
        
        # Simple collateral adjustment
        if exposure.collateral_amount > 0:
            # Haircut adjustment (simplified)
            effective_collateral = exposure.collateral_amount * Decimal("0.8")  # 20% haircut
            adjusted_exposure = max(Decimal("0"), exposure.exposure_amount - effective_collateral)
        
        return adjusted_exposure
    
    def _calculate_delta_risk(self, positions: Dict[str, Decimal]) -> Decimal:
        """Calculate delta risk for market risk"""
        # Simplified delta risk calculation
        return sum(abs(position) for position in positions.values()) * Decimal("0.01")
    
    def _calculate_vega_risk(self, var_estimates: Dict[str, Decimal]) -> Decimal:
        """Calculate vega risk for market risk"""
        # Simplified vega risk calculation
        return sum(var_estimates.values()) * Decimal("0.15")
    
    def _calculate_curvature_risk(self, positions: Dict[str, Decimal]) -> Decimal:
        """Calculate curvature risk for market risk"""
        # Simplified curvature risk calculation
        return sum(position ** 2 for position in positions.values()) * Decimal("0.005")
    
    def _calculate_drc_risk(self, positions: Dict[str, Decimal]) -> Decimal:
        """Calculate Default Risk Charge"""
        # Simplified DRC calculation
        return sum(abs(position) for position in positions.values()) * Decimal("0.02")
    
    def _get_cva_risk_weight(self, rating_grade: RatingGrade) -> Decimal:
        """Get CVA risk weight based on counterparty rating"""
        cva_weights = {
            RatingGrade.AAA_TO_AA_MINUS: Decimal("0.007"),
            RatingGrade.A_PLUS_TO_A_MINUS: Decimal("0.008"),
            RatingGrade.BBB_PLUS_TO_BBB_MINUS: Decimal("0.01"),
            RatingGrade.BB_PLUS_TO_B_MINUS: Decimal("0.015"),
            RatingGrade.BELOW_B_MINUS: Decimal("0.025"),
            RatingGrade.UNRATED: Decimal("0.01")
        }
        return cva_weights.get(rating_grade, Decimal("0.01"))
    
    def _calculate_concentration_metrics(self, exposures: List[Exposure]) -> Dict[str, Any]:
        """Calculate exposure concentration metrics"""
        if not exposures:
            return {}
        
        total_exposure = sum(e.exposure_amount for e in exposures)
        
        # By asset class
        asset_class_concentration = {}
        for asset_class in AssetClass:
            class_exposure = sum(e.exposure_amount for e in exposures if e.asset_class == asset_class)
            asset_class_concentration[asset_class.value] = float(class_exposure / total_exposure)
        
        # By rating
        rating_concentration = {}
        for rating in RatingGrade:
            rating_exposure = sum(e.exposure_amount for e in exposures if e.rating_grade == rating)
            rating_concentration[rating.value] = float(rating_exposure / total_exposure)
        
        # Top 10 counterparties
        counterparty_exposures = {}
        for exposure in exposures:
            if exposure.counterparty_id not in counterparty_exposures:
                counterparty_exposures[exposure.counterparty_id] = Decimal("0")
            counterparty_exposures[exposure.counterparty_id] += exposure.exposure_amount
        
        top_10_exposure = sum(sorted(counterparty_exposures.values(), reverse=True)[:10])
        top_10_concentration = float(top_10_exposure / total_exposure)
        
        return {
            "asset_class_distribution": asset_class_concentration,
            "rating_distribution": rating_concentration,
            "top_10_counterparty_concentration": top_10_concentration,
            "total_counterparties": len(counterparty_exposures)
        }

# Factory function for easy initialization
def create_regulatory_capital_engine(
    framework_version: str = "Basel III",
    jurisdiction: str = "EU",
    custom_config: Optional[Dict[str, Any]] = None
) -> RegulatorCapitalEngine:
    """Create regulatory capital engine with configuration"""
    
    config_params = {
        "framework_version": framework_version,
        "jurisdiction": jurisdiction
    }
    
    if custom_config:
        config_params.update(custom_config)
    
    config = BaselConfiguration(**config_params)
    return RegulatorCapitalEngine(config)

# Example usage
async def example_capital_calculation():
    """Example regulatory capital calculation"""
    
    # Initialize engine
    engine = create_regulatory_capital_engine()
    
    # Sample exposures
    exposures = [
        Exposure(
            exposure_id="corp_001",
            counterparty_id="corp_a",
            asset_class=AssetClass.CORPORATES,
            exposure_amount=Decimal("10000000"),
            rating_grade=RatingGrade.BBB_PLUS_TO_BBB_MINUS
        ),
        Exposure(
            exposure_id="bank_001", 
            counterparty_id="bank_b",
            asset_class=AssetClass.BANKS,
            exposure_amount=Decimal("5000000"),
            rating_grade=RatingGrade.A_PLUS_TO_A_MINUS
        )
    ]
    
    # Sample capital
    capital = CapitalComponents(
        common_equity_tier1=Decimal("2000000"),
        additional_tier1=Decimal("500000"),
        tier2_capital=Decimal("300000")
    )
    
    # Generate assessment
    report = engine.generate_capital_assessment_report(
        institution_id="test_bank",
        capital_components=capital,
        exposures=exposures,
        business_indicator=Decimal("100000000"),
        trading_book_positions={"equity": Decimal("1000000")},
        var_estimates={"total": Decimal("50000")},
        total_exposure=Decimal("20000000")
    )
    
    print(f"Capital Assessment Report: {report}")
    return report

if __name__ == "__main__":
    import asyncio
    asyncio.run(example_capital_calculation())