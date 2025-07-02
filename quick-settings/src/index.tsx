import React from 'react';
import { ModalDialog } from './components/ModalDialog';
import './styles.css';

// Plugin configuration
export const pluginConfig = {
  id: 'quick-settings',
  name: 'Quick Settings',
  version: '1.0.0'
};

// Main plugin component
const QuickSettingsPlugin: React.FC = () => {
  const [modalVisible, setModalVisible] = React.useState(false);

  return (
    <div className="quick-settings-plugin">
      <button onClick={() => setModalVisible(true)}>
        Open Quick Settings
      </button>
      <ModalDialog 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)} 
      />
    </div>
  );
};

export default QuickSettingsPlugin;
