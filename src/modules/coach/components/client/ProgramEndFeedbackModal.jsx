import BaseFeedbackModal from '@shared/components/feedback/BaseFeedbackModal';

/**
 * ProgramEndFeedbackModal - Zpětná vazba po dokončení celého programu
 * Thin wrapper okolo BaseFeedbackModal s program-specific props
 */
const ProgramEndFeedbackModal = ({ open, onClose, program, client, onSave }) => {
  return (
    <BaseFeedbackModal
      open={open}
      onClose={onClose}
      client={client}
      onSave={onSave}
      title="Jaký pro tebe byl celý program?"
      emoji="🎉"
      contextLabel="Po dokončení programu:"
      contextValue={program?.title}
      moodLabel="Tvoje nálada po dokončení programu:"
      textFieldLabel="Co sis všimla během celého programu?"
      textFieldPlaceholder="Např. Během programu jsem si všimla, že jsem klidnější a více v přítomném okamžiku..."
      textFieldRows={6}
      maxLength={1000}
      successTitle="Hotovo! 🎉"
      successMessage="Tvoje reflexe programu byla uložena"
      buttonText="Uložit reflexi programu"
    />
  );
};

export default ProgramEndFeedbackModal;
