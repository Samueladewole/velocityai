-- Enhanced Database Schema for Advanced Financial Instruments and Derivatives
-- Optimized for TimescaleDB with comprehensive financial modeling support

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;
CREATE EXTENSION IF NOT EXISTS btree_gin;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- =============================================
-- FINANCIAL INSTRUMENTS CORE SCHEMA
-- =============================================

-- Instrument master table
CREATE TABLE IF NOT EXISTS financial_instruments (
    instrument_id TEXT PRIMARY KEY,
    isin_code TEXT UNIQUE,
    cusip_code TEXT,
    bloomberg_id TEXT,
    reuters_id TEXT,
    instrument_name TEXT NOT NULL,
    instrument_type TEXT NOT NULL, -- equity, bond, derivative, commodity, crypto
    asset_class TEXT NOT NULL, -- equity, fixed_income, commodity, currency, alternative
    sector TEXT,
    industry TEXT,
    country_code TEXT,
    currency TEXT NOT NULL DEFAULT 'USD',
    exchange_code TEXT,
    listing_date DATE,
    maturity_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create indexes for financial instruments
CREATE INDEX IF NOT EXISTS idx_financial_instruments_type ON financial_instruments (instrument_type);
CREATE INDEX IF NOT EXISTS idx_financial_instruments_asset_class ON financial_instruments (asset_class);
CREATE INDEX IF NOT EXISTS idx_financial_instruments_currency ON financial_instruments (currency);
CREATE INDEX IF NOT EXISTS idx_financial_instruments_country ON financial_instruments (country_code);
CREATE INDEX IF NOT EXISTS idx_financial_instruments_active ON financial_instruments (is_active);
CREATE INDEX IF NOT EXISTS idx_financial_instruments_metadata ON financial_instruments USING GIN (metadata);

-- =============================================
-- DERIVATIVES AND STRUCTURED PRODUCTS
-- =============================================

-- Options contracts
CREATE TABLE IF NOT EXISTS options_contracts (
    time TIMESTAMPTZ NOT NULL,
    option_id TEXT NOT NULL,
    underlying_instrument_id TEXT NOT NULL REFERENCES financial_instruments(instrument_id),
    option_type TEXT NOT NULL, -- call, put
    option_style TEXT NOT NULL, -- american, european, asian, barrier
    strike_price DECIMAL(20,8) NOT NULL,
    expiration_date DATE NOT NULL,
    contract_size DECIMAL(20,8) DEFAULT 100,
    premium DECIMAL(20,8),
    implied_volatility DECIMAL(10,6),
    delta_greek DECIMAL(10,6),
    gamma_greek DECIMAL(10,6),
    theta_greek DECIMAL(10,6),
    vega_greek DECIMAL(10,6),
    rho_greek DECIMAL(10,6),
    open_interest INTEGER,
    volume INTEGER,
    settlement_type TEXT DEFAULT 'physical', -- physical, cash
    exchange_code TEXT,
    currency TEXT NOT NULL DEFAULT 'USD',
    is_otc BOOLEAN DEFAULT FALSE,
    counterparty_id TEXT,
    margin_requirement DECIMAL(20,8),
    metadata JSONB DEFAULT '{}'::jsonb,
    PRIMARY KEY (time, option_id)
);

-- Create hypertable for options
SELECT create_hypertable('options_contracts', 'time', 
    chunk_time_interval => INTERVAL '1 day',
    if_not_exists => TRUE);

-- Futures contracts
CREATE TABLE IF NOT EXISTS futures_contracts (
    time TIMESTAMPTZ NOT NULL,
    future_id TEXT NOT NULL,
    underlying_instrument_id TEXT REFERENCES financial_instruments(instrument_id),
    underlying_asset_type TEXT NOT NULL, -- commodity, financial, currency
    contract_month TEXT NOT NULL, -- YYYYMM format
    expiration_date DATE NOT NULL,
    delivery_date DATE,
    contract_size DECIMAL(20,8) NOT NULL,
    tick_size DECIMAL(20,8) NOT NULL,
    tick_value DECIMAL(20,8) NOT NULL,
    settlement_price DECIMAL(20,8),
    daily_settlement DECIMAL(20,8),
    open_interest INTEGER,
    volume INTEGER,
    initial_margin DECIMAL(20,8),
    maintenance_margin DECIMAL(20,8),
    settlement_type TEXT DEFAULT 'physical',
    delivery_location TEXT,
    exchange_code TEXT NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    metadata JSONB DEFAULT '{}'::jsonb,
    PRIMARY KEY (time, future_id)
);

SELECT create_hypertable('futures_contracts', 'time',
    chunk_time_interval => INTERVAL '1 day',
    if_not_exists => TRUE);

-- Swaps contracts (interest rate, currency, commodity, credit default)
CREATE TABLE IF NOT EXISTS swaps_contracts (
    time TIMESTAMPTZ NOT NULL,
    swap_id TEXT NOT NULL,
    swap_type TEXT NOT NULL, -- interest_rate, currency, commodity, credit_default, total_return
    notional_amount DECIMAL(20,8) NOT NULL,
    currency TEXT NOT NULL,
    start_date DATE NOT NULL,
    maturity_date DATE NOT NULL,
    payment_frequency TEXT, -- monthly, quarterly, semi_annual, annual
    day_count_convention TEXT, -- actual_360, actual_365, 30_360
    
    -- Fixed leg details
    fixed_rate DECIMAL(10,6),
    fixed_leg_currency TEXT,
    
    -- Floating leg details
    floating_rate_index TEXT, -- LIBOR, SOFR, EURIBOR, etc.
    floating_spread DECIMAL(10,6),
    floating_leg_currency TEXT,
    
    -- Credit default swap specific
    reference_entity TEXT,
    credit_rating TEXT,
    recovery_rate DECIMAL(6,4),
    credit_spread DECIMAL(10,6),
    
    -- Valuation metrics
    present_value DECIMAL(20,8),
    dv01 DECIMAL(20,8), -- Dollar value of 01
    duration DECIMAL(10,4),
    convexity DECIMAL(10,4),
    
    counterparty_id TEXT NOT NULL,
    collateral_agreement_id TEXT,
    netting_agreement BOOLEAN DEFAULT FALSE,
    is_cleared BOOLEAN DEFAULT FALSE,
    clearing_house TEXT,
    
    metadata JSONB DEFAULT '{}'::jsonb,
    PRIMARY KEY (time, swap_id)
);

SELECT create_hypertable('swaps_contracts', 'time',
    chunk_time_interval => INTERVAL '1 week',
    if_not_exists => TRUE);

-- =============================================
-- STRUCTURED PRODUCTS AND EXOTIC DERIVATIVES
-- =============================================

-- Structured products (CDOs, CLOs, ABS, MBS)
CREATE TABLE IF NOT EXISTS structured_products (
    time TIMESTAMPTZ NOT NULL,
    product_id TEXT NOT NULL,
    product_type TEXT NOT NULL, -- cdo, clo, abs, mbs, cmo
    underlying_pool_id TEXT,
    tranche_name TEXT,
    seniority_level INTEGER, -- 1=senior, 2=mezzanine, 3=subordinate
    notional_amount DECIMAL(20,8) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    
    -- Tranche characteristics
    attachment_point DECIMAL(6,4), -- Loss attachment point (%)
    detachment_point DECIMAL(6,4), -- Loss detachment point (%)
    expected_loss DECIMAL(6,4),
    loss_given_default DECIMAL(6,4),
    
    -- Credit metrics
    weighted_average_life DECIMAL(8,4),
    weighted_average_coupon DECIMAL(6,4),
    weighted_average_maturity DECIMAL(8,4),
    diversity_score DECIMAL(10,4),
    
    -- Ratings
    rating_agency_1 TEXT,
    rating_1 TEXT,
    rating_agency_2 TEXT,
    rating_2 TEXT,
    rating_agency_3 TEXT,
    rating_3 TEXT,
    
    -- Pricing and risk
    market_value DECIMAL(20,8),
    fair_value DECIMAL(20,8),
    credit_spread DECIMAL(10,6),
    option_adjusted_spread DECIMAL(10,6),
    effective_duration DECIMAL(10,4),
    convexity DECIMAL(10,4),
    
    originator TEXT,
    servicer TEXT,
    trustee TEXT,
    
    metadata JSONB DEFAULT '{}'::jsonb,
    PRIMARY KEY (time, product_id)
);

SELECT create_hypertable('structured_products', 'time',
    chunk_time_interval => INTERVAL '1 week',
    if_not_exists => TRUE);

-- Exotic options and barriers
CREATE TABLE IF NOT EXISTS exotic_derivatives (
    time TIMESTAMPTZ NOT NULL,
    derivative_id TEXT NOT NULL,
    derivative_type TEXT NOT NULL, -- barrier, asian, lookback, digital, basket
    underlying_instruments TEXT[], -- Array of instrument IDs
    
    -- Barrier option specifics
    barrier_type TEXT, -- up_and_out, down_and_out, up_and_in, down_and_in
    barrier_level DECIMAL(20,8),
    barrier_monitoring TEXT, -- continuous, discrete
    
    -- Asian option specifics
    averaging_type TEXT, -- arithmetic, geometric
    averaging_period_start DATE,
    averaging_period_end DATE,
    averaging_frequency TEXT, -- daily, weekly, monthly
    
    -- Digital option specifics
    payout_amount DECIMAL(20,8),
    payout_condition TEXT,
    
    -- Basket option specifics
    basket_weights DECIMAL(6,4)[],
    correlation_matrix DECIMAL(6,4)[][],
    
    -- Common valuation parameters
    strike_price DECIMAL(20,8),
    premium DECIMAL(20,8),
    expiration_date DATE,
    valuation_model TEXT, -- black_scholes, monte_carlo, finite_difference
    model_parameters JSONB,
    
    -- Greeks and sensitivities
    delta_greek DECIMAL(10,6),
    gamma_greek DECIMAL(10,6),
    theta_greek DECIMAL(10,6),
    vega_greek DECIMAL(10,6),
    rho_greek DECIMAL(10,6),
    
    counterparty_id TEXT,
    currency TEXT NOT NULL DEFAULT 'USD',
    
    metadata JSONB DEFAULT '{}'::jsonb,
    PRIMARY KEY (time, derivative_id)
);

SELECT create_hypertable('exotic_derivatives', 'time',
    chunk_time_interval => INTERVAL '1 day',
    if_not_exists => TRUE);

-- =============================================
-- FIXED INCOME INSTRUMENTS
-- =============================================

-- Bonds and fixed income securities
CREATE TABLE IF NOT EXISTS fixed_income_securities (
    time TIMESTAMPTZ NOT NULL,
    bond_id TEXT NOT NULL,
    instrument_id TEXT NOT NULL REFERENCES financial_instruments(instrument_id),
    
    -- Basic bond characteristics
    face_value DECIMAL(20,8) NOT NULL,
    coupon_rate DECIMAL(8,6),
    coupon_frequency INTEGER DEFAULT 2, -- payments per year
    issue_date DATE NOT NULL,
    maturity_date DATE NOT NULL,
    first_coupon_date DATE,
    last_coupon_date DATE,
    day_count_convention TEXT DEFAULT 'actual_actual',
    
    -- Bond type specifics
    bond_type TEXT NOT NULL, -- government, corporate, municipal, convertible, callable
    callable BOOLEAN DEFAULT FALSE,
    puttable BOOLEAN DEFAULT FALSE,
    convertible BOOLEAN DEFAULT FALSE,
    
    -- Call/Put provisions
    call_schedule JSONB, -- Array of call dates and prices
    put_schedule JSONB, -- Array of put dates and prices
    
    -- Convertible specifics
    conversion_ratio DECIMAL(10,4),
    conversion_price DECIMAL(20,8),
    underlying_stock_id TEXT,
    
    -- Credit information
    issuer_name TEXT NOT NULL,
    issuer_country TEXT,
    credit_rating TEXT,
    credit_rating_agency TEXT,
    seniority TEXT, -- senior, subordinate, junior
    
    -- Market data
    market_price DECIMAL(20,8),
    accrued_interest DECIMAL(20,8),
    yield_to_maturity DECIMAL(8,6),
    yield_to_call DECIMAL(8,6),
    yield_to_worst DECIMAL(8,6),
    modified_duration DECIMAL(10,4),
    effective_duration DECIMAL(10,4),
    convexity DECIMAL(10,4),
    
    -- Spread analysis
    g_spread DECIMAL(8,6), -- Government spread
    z_spread DECIMAL(8,6), -- Zero-volatility spread
    option_adjusted_spread DECIMAL(8,6),
    asset_swap_spread DECIMAL(8,6),
    
    currency TEXT NOT NULL DEFAULT 'USD',
    
    metadata JSONB DEFAULT '{}'::jsonb,
    PRIMARY KEY (time, bond_id)
);

SELECT create_hypertable('fixed_income_securities', 'time',
    chunk_time_interval => INTERVAL '1 day',
    if_not_exists => TRUE);

-- =============================================
-- PORTFOLIO AND POSITION TRACKING
-- =============================================

-- Portfolio positions
CREATE TABLE IF NOT EXISTS portfolio_positions (
    time TIMESTAMPTZ NOT NULL,
    position_id TEXT NOT NULL,
    portfolio_id TEXT NOT NULL,
    instrument_id TEXT NOT NULL REFERENCES financial_instruments(instrument_id),
    
    -- Position details
    quantity DECIMAL(20,8) NOT NULL,
    average_cost DECIMAL(20,8),
    market_value DECIMAL(20,8),
    unrealized_pnl DECIMAL(20,8),
    realized_pnl DECIMAL(20,8),
    
    -- Risk metrics
    var_1_day DECIMAL(20,8),
    var_10_day DECIMAL(20,8),
    expected_shortfall DECIMAL(20,8),
    beta DECIMAL(10,6),
    
    -- Greeks aggregation (for derivatives)
    total_delta DECIMAL(20,8),
    total_gamma DECIMAL(20,8),
    total_theta DECIMAL(20,8),
    total_vega DECIMAL(20,8),
    total_rho DECIMAL(20,8),
    
    -- Exposure metrics
    notional_exposure DECIMAL(20,8),
    gross_exposure DECIMAL(20,8),
    net_exposure DECIMAL(20,8),
    
    currency TEXT NOT NULL DEFAULT 'USD',
    
    metadata JSONB DEFAULT '{}'::jsonb,
    PRIMARY KEY (time, position_id)
);

SELECT create_hypertable('portfolio_positions', 'time',
    chunk_time_interval => INTERVAL '1 day',
    if_not_exists => TRUE);

-- =============================================
-- RISK FACTORS AND SCENARIOS
-- =============================================

-- Risk factors time series
CREATE TABLE IF NOT EXISTS risk_factors (
    time TIMESTAMPTZ NOT NULL,
    factor_id TEXT NOT NULL,
    factor_type TEXT NOT NULL, -- interest_rate, equity_index, fx_rate, commodity, credit_spread, volatility
    factor_name TEXT NOT NULL,
    factor_value DECIMAL(20,8) NOT NULL,
    factor_change DECIMAL(20,8),
    factor_change_percent DECIMAL(10,6),
    
    -- Factor characteristics
    currency TEXT,
    maturity TEXT, -- For yield curve factors
    sector TEXT, -- For equity factors
    geography TEXT,
    
    -- Statistical measures
    volatility_1m DECIMAL(10,6),
    volatility_3m DECIMAL(10,6),
    volatility_1y DECIMAL(10,6),
    
    data_source TEXT,
    
    metadata JSONB DEFAULT '{}'::jsonb,
    PRIMARY KEY (time, factor_id)
);

SELECT create_hypertable('risk_factors', 'time',
    chunk_time_interval => INTERVAL '1 hour',
    if_not_exists => TRUE);

-- Stress test scenarios
CREATE TABLE IF NOT EXISTS stress_scenarios (
    scenario_id TEXT PRIMARY KEY,
    scenario_name TEXT NOT NULL,
    scenario_type TEXT NOT NULL, -- historical, hypothetical, regulatory
    scenario_description TEXT,
    
    -- Scenario parameters
    factor_shocks JSONB NOT NULL, -- Risk factor shock specifications
    correlation_adjustments JSONB, -- Modified correlations
    time_horizon INTEGER, -- Days
    
    -- Regulatory scenarios
    regulatory_framework TEXT, -- basel_iii, solvency_ii, ccar
    scenario_year INTEGER,
    severity_level TEXT, -- baseline, adverse, severely_adverse
    
    created_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    
    metadata JSONB DEFAULT '{}'::jsonb
);

-- =============================================
-- VALUATION AND PRICING MODELS
-- =============================================

-- Model calibration and parameters
CREATE TABLE IF NOT EXISTS pricing_models (
    time TIMESTAMPTZ NOT NULL,
    model_id TEXT NOT NULL,
    model_name TEXT NOT NULL,
    model_type TEXT NOT NULL, -- black_scholes, heston, hull_white, libor_market, etc.
    instrument_types TEXT[], -- Applicable instrument types
    
    -- Model parameters
    model_parameters JSONB NOT NULL,
    calibration_date DATE,
    calibration_instruments TEXT[], -- Instruments used for calibration
    calibration_quality_metrics JSONB,
    
    -- Performance metrics
    pricing_accuracy DECIMAL(8,6),
    hedge_effectiveness DECIMAL(8,6),
    computation_time_ms INTEGER,
    
    model_version TEXT,
    is_production BOOLEAN DEFAULT FALSE,
    
    metadata JSONB DEFAULT '{}'::jsonb,
    PRIMARY KEY (time, model_id)
);

SELECT create_hypertable('pricing_models', 'time',
    chunk_time_interval => INTERVAL '1 day',
    if_not_exists => TRUE);

-- =============================================
-- REGULATORY REPORTING TABLES
-- =============================================

-- Basel III regulatory exposures
CREATE TABLE IF NOT EXISTS basel_exposures (
    time TIMESTAMPTZ NOT NULL,
    exposure_id TEXT NOT NULL,
    reporting_entity TEXT NOT NULL,
    
    -- Counterparty information
    counterparty_id TEXT NOT NULL,
    counterparty_type TEXT NOT NULL, -- sovereign, bank, corporate, retail
    counterparty_rating TEXT,
    country_code TEXT,
    
    -- Exposure details
    instrument_id TEXT REFERENCES financial_instruments(instrument_id),
    exposure_type TEXT NOT NULL, -- on_balance, off_balance, derivative
    exposure_amount DECIMAL(20,8) NOT NULL,
    exposure_at_default DECIMAL(20,8),
    
    -- Risk parameters
    probability_of_default DECIMAL(8,6),
    loss_given_default DECIMAL(8,6),
    effective_maturity DECIMAL(8,4),
    
    -- Risk weights and capital
    risk_weight DECIMAL(6,4),
    risk_weighted_assets DECIMAL(20,8),
    capital_requirement DECIMAL(20,8),
    
    -- Credit risk mitigation
    collateral_value DECIMAL(20,8),
    guarantee_value DECIMAL(20,8),
    netting_benefit DECIMAL(20,8),
    
    currency TEXT NOT NULL DEFAULT 'USD',
    
    metadata JSONB DEFAULT '{}'::jsonb,
    PRIMARY KEY (time, exposure_id)
);

SELECT create_hypertable('basel_exposures', 'time',
    chunk_time_interval => INTERVAL '1 day',
    if_not_exists => TRUE);

-- FRTB sensitivities for market risk
CREATE TABLE IF NOT EXISTS frtb_sensitivities (
    time TIMESTAMPTZ NOT NULL,
    sensitivity_id TEXT NOT NULL,
    desk_id TEXT NOT NULL,
    risk_class TEXT NOT NULL, -- delta, vega, curvature
    risk_factor_type TEXT NOT NULL, -- interest_rate, credit_spread, equity, fx, commodity
    
    -- Sensitivity details
    bucket TEXT, -- FRTB bucket classification
    risk_factor TEXT,
    sensitivity_value DECIMAL(20,8) NOT NULL,
    
    -- Aggregation levels
    weighted_sensitivity DECIMAL(20,8),
    kb_value DECIMAL(20,8), -- Knowledge Base capital requirement
    sb_value DECIMAL(20,8), -- Stress scenario capital requirement
    
    currency TEXT NOT NULL DEFAULT 'USD',
    
    metadata JSONB DEFAULT '{}'::jsonb,
    PRIMARY KEY (time, sensitivity_id)
);

SELECT create_hypertable('frtb_sensitivities', 'time',
    chunk_time_interval => INTERVAL '1 day',
    if_not_exists => TRUE);

-- =============================================
-- PERFORMANCE OPTIMIZATION INDEXES
-- =============================================

-- Options contracts indexes
CREATE INDEX IF NOT EXISTS idx_options_underlying ON options_contracts (underlying_instrument_id, time DESC);
CREATE INDEX IF NOT EXISTS idx_options_type_expiry ON options_contracts (option_type, expiration_date);
CREATE INDEX IF NOT EXISTS idx_options_strike ON options_contracts (strike_price);
CREATE INDEX IF NOT EXISTS idx_options_volume ON options_contracts (volume DESC);

-- Futures contracts indexes
CREATE INDEX IF NOT EXISTS idx_futures_underlying ON futures_contracts (underlying_instrument_id, time DESC);
CREATE INDEX IF NOT EXISTS idx_futures_month ON futures_contracts (contract_month);
CREATE INDEX IF NOT EXISTS idx_futures_exchange ON futures_contracts (exchange_code);

-- Swaps contracts indexes
CREATE INDEX IF NOT EXISTS idx_swaps_type ON swaps_contracts (swap_type, time DESC);
CREATE INDEX IF NOT EXISTS idx_swaps_counterparty ON swaps_contracts (counterparty_id, time DESC);
CREATE INDEX IF NOT EXISTS idx_swaps_maturity ON swaps_contracts (maturity_date);

-- Fixed income indexes
CREATE INDEX IF NOT EXISTS idx_bonds_issuer ON fixed_income_securities (issuer_name, time DESC);
CREATE INDEX IF NOT EXISTS idx_bonds_rating ON fixed_income_securities (credit_rating);
CREATE INDEX IF NOT EXISTS idx_bonds_maturity ON fixed_income_securities (maturity_date);
CREATE INDEX IF NOT EXISTS idx_bonds_type ON fixed_income_securities (bond_type);

-- Portfolio positions indexes
CREATE INDEX IF NOT EXISTS idx_positions_portfolio ON portfolio_positions (portfolio_id, time DESC);
CREATE INDEX IF NOT EXISTS idx_positions_instrument ON portfolio_positions (instrument_id, time DESC);
CREATE INDEX IF NOT EXISTS idx_positions_value ON portfolio_positions (market_value DESC);

-- Risk factors indexes
CREATE INDEX IF NOT EXISTS idx_risk_factors_type ON risk_factors (factor_type, time DESC);
CREATE INDEX IF NOT EXISTS idx_risk_factors_name ON risk_factors (factor_name, time DESC);

-- Basel exposures indexes
CREATE INDEX IF NOT EXISTS idx_basel_counterparty ON basel_exposures (counterparty_id, time DESC);
CREATE INDEX IF NOT EXISTS idx_basel_type ON basel_exposures (counterparty_type, time DESC);
CREATE INDEX IF NOT EXISTS idx_basel_rwa ON basel_exposures (risk_weighted_assets DESC);

-- FRTB sensitivities indexes
CREATE INDEX IF NOT EXISTS idx_frtb_desk ON frtb_sensitivities (desk_id, time DESC);
CREATE INDEX IF NOT EXISTS idx_frtb_risk_class ON frtb_sensitivities (risk_class, time DESC);
CREATE INDEX IF NOT EXISTS idx_frtb_bucket ON frtb_sensitivities (bucket, time DESC);

-- =============================================
-- COMPRESSION AND RETENTION POLICIES
-- =============================================

-- Enable compression for older data (if not already enabled)
SELECT add_compression_policy('options_contracts', INTERVAL '7 days', if_not_exists => TRUE);
SELECT add_compression_policy('futures_contracts', INTERVAL '7 days', if_not_exists => TRUE);
SELECT add_compression_policy('swaps_contracts', INTERVAL '30 days', if_not_exists => TRUE);
SELECT add_compression_policy('structured_products', INTERVAL '30 days', if_not_exists => TRUE);
SELECT add_compression_policy('exotic_derivatives', INTERVAL '7 days', if_not_exists => TRUE);
SELECT add_compression_policy('fixed_income_securities', INTERVAL '7 days', if_not_exists => TRUE);
SELECT add_compression_policy('portfolio_positions', INTERVAL '7 days', if_not_exists => TRUE);
SELECT add_compression_policy('risk_factors', INTERVAL '1 day', if_not_exists => TRUE);
SELECT add_compression_policy('pricing_models', INTERVAL '30 days', if_not_exists => TRUE);
SELECT add_compression_policy('basel_exposures', INTERVAL '30 days', if_not_exists => TRUE);
SELECT add_compression_policy('frtb_sensitivities', INTERVAL '30 days', if_not_exists => TRUE);

-- Data retention policies
SELECT add_retention_policy('options_contracts', INTERVAL '3 years', if_not_exists => TRUE);
SELECT add_retention_policy('futures_contracts', INTERVAL '3 years', if_not_exists => TRUE);
SELECT add_retention_policy('swaps_contracts', INTERVAL '10 years', if_not_exists => TRUE);
SELECT add_retention_policy('structured_products', INTERVAL '10 years', if_not_exists => TRUE);
SELECT add_retention_policy('exotic_derivatives', INTERVAL '5 years', if_not_exists => TRUE);
SELECT add_retention_policy('fixed_income_securities', INTERVAL '5 years', if_not_exists => TRUE);
SELECT add_retention_policy('portfolio_positions', INTERVAL '7 years', if_not_exists => TRUE);
SELECT add_retention_policy('risk_factors', INTERVAL '10 years', if_not_exists => TRUE);
SELECT add_retention_policy('pricing_models', INTERVAL '5 years', if_not_exists => TRUE);
SELECT add_retention_policy('basel_exposures', INTERVAL '7 years', if_not_exists => TRUE);
SELECT add_retention_policy('frtb_sensitivities', INTERVAL '7 years', if_not_exists => TRUE);

-- =============================================
-- VIEWS FOR COMMON QUERIES
-- =============================================

-- Current portfolio summary view
CREATE OR REPLACE VIEW current_portfolio_summary AS
SELECT 
    portfolio_id,
    COUNT(DISTINCT instrument_id) as num_positions,
    SUM(market_value) as total_market_value,
    SUM(unrealized_pnl) as total_unrealized_pnl,
    SUM(var_1_day) as portfolio_var_1_day,
    SUM(ABS(total_delta)) as total_delta_exposure,
    MAX(time) as last_updated
FROM portfolio_positions 
WHERE time >= NOW() - INTERVAL '1 day'
GROUP BY portfolio_id;

-- Current derivatives exposure view
CREATE OR REPLACE VIEW current_derivatives_exposure AS
SELECT 
    'options' as derivative_type,
    COUNT(*) as num_contracts,
    SUM(ABS(delta_greek * contract_size)) as delta_exposure,
    SUM(ABS(gamma_greek * contract_size)) as gamma_exposure,
    currency
FROM options_contracts 
WHERE time >= NOW() - INTERVAL '1 day'
GROUP BY currency
UNION ALL
SELECT 
    'futures' as derivative_type,
    COUNT(*) as num_contracts,
    SUM(settlement_price * contract_size) as delta_exposure,
    0 as gamma_exposure,
    currency
FROM futures_contracts 
WHERE time >= NOW() - INTERVAL '1 day'
GROUP BY currency;

-- Risk factor correlation matrix view
CREATE OR REPLACE VIEW risk_factor_correlations AS
WITH factor_returns AS (
    SELECT 
        factor_id,
        factor_name,
        factor_change_percent,
        time::date as trade_date
    FROM risk_factors 
    WHERE time >= NOW() - INTERVAL '1 year'
        AND factor_change_percent IS NOT NULL
)
SELECT 
    a.factor_name as factor_1,
    b.factor_name as factor_2,
    CORR(a.factor_change_percent, b.factor_change_percent) as correlation
FROM factor_returns a
JOIN factor_returns b ON a.trade_date = b.trade_date
WHERE a.factor_id <= b.factor_id
GROUP BY a.factor_name, b.factor_name
HAVING COUNT(*) >= 252; -- At least 1 year of data

-- =============================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- =============================================

-- Function to update timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for financial_instruments
CREATE TRIGGER update_financial_instruments_modtime 
    BEFORE UPDATE ON financial_instruments 
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- =============================================
-- GRANTS AND PERMISSIONS
-- =============================================

-- Grant permissions for application users
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO erip_app_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO erip_app_user;

-- Grant read-only access for reporting users
GRANT SELECT ON ALL TABLES IN SCHEMA public TO erip_readonly_user;

-- Grant limited access for risk users
GRANT SELECT, INSERT, UPDATE ON options_contracts TO erip_risk_user;
GRANT SELECT, INSERT, UPDATE ON futures_contracts TO erip_risk_user;
GRANT SELECT, INSERT, UPDATE ON swaps_contracts TO erip_risk_user;
GRANT SELECT, INSERT, UPDATE ON portfolio_positions TO erip_risk_user;
GRANT SELECT, INSERT, UPDATE ON risk_factors TO erip_risk_user;

COMMENT ON SCHEMA public IS 'Enhanced schema for advanced financial instruments and derivatives - optimized for ERIP financial intelligence platform';