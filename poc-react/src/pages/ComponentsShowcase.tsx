/**
 * ComponentsShowcase Page (Prompt A - CreateComponent)
 * Demonstrates all UI components with various states
 */

import React, { useState } from 'react';
import { Button, Input, Modal } from '../components';

const ComponentsShowcase: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleDemoSubmit = async () => {
    if (!inputValue.trim()) {
      setInputError('Field cannot be empty');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsModalOpen(false);
      setInputValue('');
      setInputError('');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-900 mb-8">
          Prompt A: CreateComponent
        </h1>

        {/* Button Examples */}
        <section className="bg-white rounded-lg shadow p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Button Component Examples
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Variants</h3>
              <div className="space-y-3">
                <Button variant="primary">Primary Button</Button>
                <Button variant="secondary">Secondary Button</Button>
                <Button variant="danger">Danger Button</Button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Sizes</h3>
              <div className="space-y-3">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">States</h3>
              <div className="space-y-3">
                <Button disabled>Disabled</Button>
                <Button isLoading>Loading...</Button>
                <Button onClick={() => setIsModalOpen(true)}>
                  Open Modal
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Input Examples */}
        <section className="bg-white rounded-lg shadow p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Input Component Examples
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Text Input"
              placeholder="Enter text..."
              helperText="This is helper text"
            />

            <Input
              label="Email Input"
              type="email"
              placeholder="user@example.com"
            />

            <Input
              label="Password Input"
              type="password"
              placeholder="Enter password"
            />

            <Input
              label="Error State"
              error="This field has an error"
              defaultValue="Invalid value"
            />

            <Input
              label="Disabled Input"
              disabled
              defaultValue="Disabled state"
            />

            <Input
              label="With Counter"
              maxLength={50}
              placeholder="Max 50 characters"
            />
          </div>
        </section>

        {/* Modal Example */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Example Modal"
          footer={
            <div className="flex gap-3 ml-auto">
              <Button
                variant="secondary"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                isLoading={isLoading}
                onClick={handleDemoSubmit}
              >
                Submit
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <p className="text-slate-700">
              This demonstrates a Modal component with Input and Button inside.
            </p>

            <Input
              label="Name"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                if (inputError) setInputError('');
              }}
              error={inputError}
              placeholder="Enter your name"
            />
          </div>
        </Modal>

        {/* Code Example */}
        <section className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Code Examples
          </h2>

          <div className="bg-slate-900 text-slate-100 p-4 rounded overflow-x-auto">
            <pre className="text-sm">{`// Button with props
<Button 
  variant="primary" 
  size="lg" 
  onClick={handleClick}
>
  Click Me
</Button>

// Input with validation
<Input
  label="Email"
  type="email"
  error={errors.email}
  helper Text="Use your work email"
/>

// Modal with content
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Confirm Action"
>
  Are you sure?
</Modal>`}</pre>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ComponentsShowcase;
