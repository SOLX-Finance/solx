import { Button } from '../components/ui/button';

export function App() {
  return (
    <div className="p-4">
      <div className="my-8 space-y-4">
        <h2 className="text-2xl font-bold">ShadCN Components</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="default">Default Button</Button>
          <Button variant="destructive">Destructive Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button variant="link">Link Button</Button>
        </div>
      </div>
    </div>
  );
}

export default App;
