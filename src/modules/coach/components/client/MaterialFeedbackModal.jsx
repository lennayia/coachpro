import BaseFeedbackModal from '@shared/components/feedback/BaseFeedbackModal';

/**
 * MaterialFeedbackModal - Zpětná vazba po použití materiálu
 * Thin wrapper okolo BaseFeedbackModal s material-specific props
 */
const MaterialFeedbackModal = ({ open, onClose, material, client, onSave }) => {
  return (
    <BaseFeedbackModal
      open={open}
      onClose={onClose}
      client={client}
      onSave={onSave}
      title="Jak se teď cítíš?"
      emoji="🌿"
      contextLabel="Po poslechu:"
      contextValue={material?.title}
      moodLabel="Tvoje nálada po poslechu:"
      textFieldLabel="Co sis všimla během meditace?"
      textFieldPlaceholder="Např. Všimla jsem si, že mé myšlenky byly klidnější než obvykle..."
      textFieldRows={5}
      maxLength={500}
      successTitle="Uloženo! ✓"
      successMessage="Tvoje reflexe byla uložena"
      buttonText="Uložit reflexi"
    />
  );
};

export default MaterialFeedbackModal;
