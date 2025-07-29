import { DateProvider } from '@/components/shared/DateProvider';
import VelocityAppSimple from './VelocityAppSimple';

function App() {
  // Velocity.ai is now the primary platform
  console.log('Rendering Velocity.ai platform');
  
  return (
    <DateProvider>
      <VelocityAppSimple />
    </DateProvider>
  );
}

export default App;