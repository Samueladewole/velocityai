/**
 * Remotion Video Entry Point
 * Main video composition registry
 */

import { Composition, Folder } from 'remotion';
import { TrustScoreVideo } from './compositions/TrustScoreVideo';
import { DashboardDemo } from './compositions/DashboardDemo';
import { FeatureShowcase } from './compositions/FeatureShowcase';
import { PlatformOverview } from './compositions/PlatformOverview';
import { ROICalculatorDemo } from './compositions/ROICalculatorDemo';
import { SSODemoVideo } from './compositions/SSODemoVideo';

// Video configurations
export const VIDEO_CONFIG = {
  fps: 30,
  width: 1920,
  height: 1080,
};

export const RemotionVideo: React.FC = () => {
  return (
    <>
      <Folder name="Platform Demos">
        <Composition
          id="TrustScoreVideo"
          component={TrustScoreVideo}
          durationInFrames={300} // 10 seconds
          fps={VIDEO_CONFIG.fps}
          width={VIDEO_CONFIG.width}
          height={VIDEO_CONFIG.height}
          defaultProps={{
            title: "Velocity Trust Intelligence",
            finalScore: 94
          }}
        />

        <Composition
          id="DashboardDemo"
          component={DashboardDemo}
          durationInFrames={600} // 20 seconds
          fps={VIDEO_CONFIG.fps}
          width={VIDEO_CONFIG.width}
          height={VIDEO_CONFIG.height}
          defaultProps={{
            title: "Velocity Dashboard Overview"
          }}
        />

        <Composition
          id="FeatureShowcase"
          component={FeatureShowcase}
          durationInFrames={450} // 15 seconds
          fps={VIDEO_CONFIG.fps}
          width={VIDEO_CONFIG.width}
          height={VIDEO_CONFIG.height}
          defaultProps={{
            title: "AI-Powered Compliance Automation"
          }}
        />
      </Folder>

      <Folder name="Marketing Videos">
        <Composition
          id="PlatformOverview"
          component={PlatformOverview}
          durationInFrames={900} // 30 seconds
          fps={VIDEO_CONFIG.fps}
          width={VIDEO_CONFIG.width}
          height={VIDEO_CONFIG.height}
          defaultProps={{
            title: "Transform Your Security Into Revenue"
          }}
        />

        <Composition
          id="ROICalculatorDemo"
          component={ROICalculatorDemo}
          durationInFrames={480} // 16 seconds
          fps={VIDEO_CONFIG.fps}
          width={VIDEO_CONFIG.width}
          height={VIDEO_CONFIG.height}
          defaultProps={{
            title: "Calculate Your Compliance ROI"
          }}
        />

        <Composition
          id="SSODemoVideo"
          component={SSODemoVideo}
          durationInFrames={360} // 12 seconds
          fps={VIDEO_CONFIG.fps}
          width={VIDEO_CONFIG.width}
          height={VIDEO_CONFIG.height}
          defaultProps={{
            title: "Enterprise SSO Integration"
          }}
        />
      </Folder>
    </>
  );
};