import ShareWithClientModal from '@shared/components/sharing/ShareWithClientModal';
import { getCurrentUser, createSharedProgramHelper, getSharedProgramsByCoach, validateClientExists } from '../../utils/storage';
import { formatDate } from '@shared/utils/helpers';

/**
 * ShareProgramModal - Wrapper for sharing programs with clients
 * Uses the universal ShareWithClientModal component
 */
const ShareProgramModal = ({ open, onClose, program }) => {
  if (!program) return null;

  const currentUser = getCurrentUser();

  return (
    <ShareWithClientModal
      open={open}
      onClose={onClose}
      content={program}
      contentType="program"
      onShare={async (data) => {
        if (!currentUser) {
          throw new Error('Není přihlášený žádný kouč');
        }

        const sharedProgram = await createSharedProgramHelper(
          program,
          currentUser.id,
          data.clientName,
          data.clientEmail,
          data.accessStartDate,
          data.accessEndDate
        );

        return sharedProgram;
      }}
      getShareText={(shared) => {
        const accessInfo = shared.accessEndDate
          ? `\n⏰ Dostupné: ${formatDate(shared.accessStartDate, { day: 'numeric', month: 'numeric', year: 'numeric' })} - ${formatDate(shared.accessEndDate, { day: 'numeric', month: 'numeric', year: 'numeric' })}`
          : `\n⏰ Dostupné od: ${formatDate(shared.accessStartDate, { day: 'numeric', month: 'numeric', year: 'numeric' })}`;

        return `🌿 CoachPro - ${program.title}

${program.description || ''}

⏱️ Délka: ${program.duration} dní
📚 ${program.days.reduce((acc, day) => acc + (day.materialIds?.length || 0), 0)} materiálů${accessInfo}

🔑 Pro přístup k programu zadej tento kód v aplikaci CoachPro:
${shared.shareCode}

Těším se na tvůj růst! 💚`;
      }}
      getContentInfo={(prog) => ({
        title: prog.title,
        subtitle: `${prog.duration} dní • ${prog.days.reduce((acc, day) => acc + (day.materialIds?.length || 0), 0)} materiálů`
      })}
      checkDuplicate={async (email, prog) => {
        if (!currentUser) return null;

        const allSharedPrograms = await getSharedProgramsByCoach(currentUser.id);
        return allSharedPrograms.find(
          sp => sp.programId === prog.id &&
                sp.clientEmail &&
                sp.clientEmail.toLowerCase() === email.toLowerCase()
        );
      }}
      validateClient={validateClientExists}
    />
  );
};

export default ShareProgramModal;
