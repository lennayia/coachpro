/**
 * CoachCard Component
 * Reusable card for displaying coach information
 * Used in coach selection, coach listing, etc.
 */

import { Card, CardContent, Box, Typography, Avatar, IconButton, Chip, Divider, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { Phone, Mail, Award, Briefcase, GraduationCap, ChevronDown, Linkedin, Instagram, Facebook, Globe, MessageCircle, Send } from 'lucide-react';
import { useTheme } from '@mui/material';
import { useState } from 'react';
import BORDER_RADIUS from '@styles/borderRadius';
import { formatPhoneNumber, getCoachInitials } from '@shared/utils/coaches';
import { getUserPhotoUrl } from '@shared/utils/avatarHelper';

const CoachCard = ({ coach, onClick, compact = false, showFullProfile = false, counts = null }) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  if (!coach) return null;

  // Get photo URL (custom uploaded or fallback to initials)
  const photoUrl = coach?.photo_url;

  // Parse specializations (if it's a string, split by comma)
  const specializations = coach?.specializations
    ? typeof coach.specializations === 'string'
      ? coach.specializations.split(',').map(s => s.trim()).filter(Boolean)
      : coach.specializations
    : [];

  const handleAccordionClick = (e) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: BORDER_RADIUS.card,
        border: '1px solid',
        borderColor: 'divider',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s',
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? 'rgba(26, 36, 16, 0.8)'
            : 'rgba(255, 255, 255, 0.95)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': onClick
          ? {
              borderColor: 'primary.main',
              transform: 'translateY(-4px)',
              boxShadow: (theme) =>
                theme.palette.mode === 'dark'
                  ? '0 8px 24px rgba(139, 188, 143, 0.15)'
                  : '0 8px 24px rgba(85, 107, 47, 0.15)',
            }
          : {},
      }}
      onClick={onClick}
    >
      <CardContent sx={{ p: compact ? 2 : 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Avatar */}
          <Avatar
            src={photoUrl}
            imgProps={{
              referrerPolicy: 'no-referrer',
              loading: 'eager'
            }}
            sx={{
              width: compact ? 56 : 72,
              height: compact ? 56 : 72,
              bgcolor: 'primary.main',
              fontSize: compact ? 20 : 28,
              fontWeight: 600,
              border: '2px solid',
              borderColor: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(139, 188, 143, 0.3)'
                  : 'rgba(85, 107, 47, 0.2)',
            }}
          >
            {!photoUrl && getCoachInitials(coach.name)}
          </Avatar>

          {/* Info */}
          <Box sx={{ flex: 1 }}>
            <Typography
              variant={compact ? 'h6' : 'h5'}
              fontWeight={600}
              gutterBottom
              sx={{
                mb: compact ? 0.5 : 1,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                lineHeight: 1.3,
                minHeight: showFullProfile ? '2.6em' : 'auto',
              }}
            >
              {coach.name}
            </Typography>

            {/* Contact Info - only show if not showing full profile */}
            {!showFullProfile && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                {coach.email && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Mail
                      size={compact ? 14 : 16}
                      color={theme.palette.text.secondary}
                    />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: compact ? '0.8rem' : '0.875rem' }}
                    >
                      {coach.email}
                    </Typography>
                  </Box>
                )}

                {coach.phone && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Phone
                      size={compact ? 14 : 16}
                      color={theme.palette.text.secondary}
                    />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: compact ? '0.8rem' : '0.875rem' }}
                    >
                      {formatPhoneNumber(coach.phone)}
                    </Typography>
                  </Box>
                )}
              </Box>
            )}

            {/* Basic Profile Info - always show when showFullProfile is true */}
            {showFullProfile && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                {/* First specialization - Obor/Téma - 1 řádek */}
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: 'primary.main',
                    height: '1.2em',
                    lineHeight: 1.2,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {specializations.length > 0 ? specializations[0] : '\u00A0'}
                </Typography>

                {/* Second specialization - Další téma - 1 řádek */}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontSize: '0.8rem',
                    height: '1.2em',
                    lineHeight: 1.2,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {specializations.length > 1 ? specializations[1] : '\u00A0'}
                </Typography>

                {/* Third specialization - Druh koučinku - 1 řádek */}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontSize: '0.8rem',
                    height: '1.2em',
                    lineHeight: 1.2,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {specializations.length > 2 ? specializations[2] : '\u00A0'}
                </Typography>

                {/* Bio preview - 3 řádky */}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontSize: '0.8rem',
                    mt: 0.5,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    lineHeight: 1.4,
                    minHeight: coach.bio ? '3.2em' : '3.2em', // Always reserve space for 3 lines
                  }}
                >
                  {coach.bio || '\u00A0'}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Action buttons (if interactive) */}
          {onClick && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {coach.email && (
                <IconButton
                  size="small"
                  href={`mailto:${coach.email}`}
                  onClick={(e) => e.stopPropagation()}
                  sx={{
                    color: 'primary.main',
                    '&:hover': {
                      backgroundColor: (theme) =>
                        theme.palette.mode === 'dark'
                          ? 'rgba(139, 188, 143, 0.15)'
                          : 'rgba(85, 107, 47, 0.1)',
                    },
                  }}
                >
                  <Mail size={18} />
                </IconButton>
              )}

              {coach.phone && (
                <IconButton
                  size="small"
                  href={`tel:${coach.phone}`}
                  onClick={(e) => e.stopPropagation()}
                  sx={{
                    color: 'primary.main',
                    '&:hover': {
                      backgroundColor: (theme) =>
                        theme.palette.mode === 'dark'
                          ? 'rgba(139, 188, 143, 0.15)'
                          : 'rgba(85, 107, 47, 0.1)',
                    },
                  }}
                >
                  <Phone size={18} />
                </IconButton>
              )}
            </Box>
          )}
        </Box>

        {/* Spacer to push accordion to bottom */}
        <Box sx={{ flex: 1 }} />

        {/* Accordion with additional details */}
        {showFullProfile && (coach.bio || coach.education || specializations.length > 1 || coach.email || coach.phone) && (
          <Accordion
            expanded={expanded}
            onChange={handleAccordionClick}
            elevation={0}
            disableGutters
            sx={{
              background: 'transparent',
              '&:before': {
                display: 'none',
              },
              mt: 2,
            }}
          >
            <AccordionSummary
              expandIcon={<ChevronDown size={20} />}
              sx={{
                minHeight: 'auto',
                px: 0,
                '& .MuiAccordionSummary-content': {
                  my: 1,
                },
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                Víc info
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ px: 0, pt: 0 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* Counts - only show if provided */}
                {counts && (counts.programs > 0 || counts.materials > 0 || counts.sessions > 0) && (
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
                      Co od této koučky máte:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {counts.programs > 0 && (
                        <Chip
                          label={`${counts.programs} ${counts.programs === 1 ? 'program' : counts.programs < 5 ? 'programy' : 'programů'}`}
                          size="small"
                          sx={{
                            fontSize: '0.75rem',
                            bgcolor: (theme) =>
                              theme.palette.mode === 'dark'
                                ? 'rgba(139, 188, 143, 0.15)'
                                : 'rgba(85, 107, 47, 0.1)',
                            color: 'primary.main',
                          }}
                        />
                      )}
                      {counts.materials > 0 && (
                        <Chip
                          label={`${counts.materials} ${counts.materials === 1 ? 'materiál' : counts.materials < 5 ? 'materiály' : 'materiálů'}`}
                          size="small"
                          sx={{
                            fontSize: '0.75rem',
                            bgcolor: (theme) =>
                              theme.palette.mode === 'dark'
                                ? 'rgba(139, 188, 143, 0.15)'
                                : 'rgba(85, 107, 47, 0.1)',
                            color: 'primary.main',
                          }}
                        />
                      )}
                      {counts.sessions > 0 && (
                        <Chip
                          label={`${counts.sessions} ${counts.sessions === 1 ? 'sezení' : 'sezení'}`}
                          size="small"
                          sx={{
                            fontSize: '0.75rem',
                            bgcolor: (theme) =>
                              theme.palette.mode === 'dark'
                                ? 'rgba(139, 188, 143, 0.15)'
                                : 'rgba(85, 107, 47, 0.1)',
                            color: 'primary.main',
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                )}

                {/* Bio */}
                {coach.bio && (
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
                      O mně:
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      {coach.bio}
                    </Typography>
                  </Box>
                )}

                {/* Education */}
                {coach.education && (
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
                      Vzdělání:
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {coach.education}
                    </Typography>
                  </Box>
                )}

                {/* All Specializations */}
                {specializations.length > 1 && (
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
                      Všechny specializace:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {specializations.map((spec, index) => (
                        <Chip
                          key={index}
                          label={spec}
                          size="small"
                          sx={{
                            fontSize: '0.7rem',
                            height: 24,
                            bgcolor: (theme) =>
                              theme.palette.mode === 'dark'
                                ? 'rgba(139, 188, 143, 0.15)'
                                : 'rgba(85, 107, 47, 0.1)',
                            color: 'primary.main',
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}

                {/* Contact Information */}
                {(coach.email || coach.phone) && (
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
                      Kontakt:
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      {coach.email && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Mail size={14} color={theme.palette.text.secondary} />
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                            {coach.email}
                          </Typography>
                        </Box>
                      )}
                      {coach.phone && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Phone size={14} color={theme.palette.text.secondary} />
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                            {formatPhoneNumber(coach.phone)}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                )}

                {/* Social Media & Links */}
                {(coach.linkedin || coach.instagram || coach.facebook || coach.website || coach.whatsapp || coach.telegram) && (
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mb: 1 }}>
                      Najdete mě také na:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {coach.linkedin && (
                        <IconButton
                          size="small"
                          component="a"
                          href={coach.linkedin.startsWith('http') ? coach.linkedin : `https://linkedin.com/in/${coach.linkedin}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          sx={{
                            color: '#0A66C2',
                            bgcolor: 'rgba(10, 102, 194, 0.1)',
                            '&:hover': { bgcolor: 'rgba(10, 102, 194, 0.2)' },
                          }}
                        >
                          <Linkedin size={18} />
                        </IconButton>
                      )}
                      {coach.instagram && (
                        <IconButton
                          size="small"
                          component="a"
                          href={coach.instagram.startsWith('http') ? coach.instagram : `https://instagram.com/${coach.instagram}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          sx={{
                            color: '#E4405F',
                            bgcolor: 'rgba(228, 64, 95, 0.1)',
                            '&:hover': { bgcolor: 'rgba(228, 64, 95, 0.2)' },
                          }}
                        >
                          <Instagram size={18} />
                        </IconButton>
                      )}
                      {coach.facebook && (
                        <IconButton
                          size="small"
                          component="a"
                          href={coach.facebook.startsWith('http') ? coach.facebook : `https://facebook.com/${coach.facebook}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          sx={{
                            color: '#1877F2',
                            bgcolor: 'rgba(24, 119, 242, 0.1)',
                            '&:hover': { bgcolor: 'rgba(24, 119, 242, 0.2)' },
                          }}
                        >
                          <Facebook size={18} />
                        </IconButton>
                      )}
                      {coach.website && (
                        <IconButton
                          size="small"
                          component="a"
                          href={coach.website.startsWith('http') ? coach.website : `https://${coach.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          sx={{
                            color: theme.palette.primary.main,
                            bgcolor: (theme) =>
                              theme.palette.mode === 'dark'
                                ? 'rgba(139, 188, 143, 0.15)'
                                : 'rgba(85, 107, 47, 0.1)',
                            '&:hover': {
                              bgcolor: (theme) =>
                                theme.palette.mode === 'dark'
                                  ? 'rgba(139, 188, 143, 0.25)'
                                  : 'rgba(85, 107, 47, 0.2)',
                            },
                          }}
                        >
                          <Globe size={18} />
                        </IconButton>
                      )}
                      {coach.whatsapp && (
                        <IconButton
                          size="small"
                          component="a"
                          href={`https://wa.me/${coach.whatsapp.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          sx={{
                            color: '#25D366',
                            bgcolor: 'rgba(37, 211, 102, 0.1)',
                            '&:hover': { bgcolor: 'rgba(37, 211, 102, 0.2)' },
                          }}
                        >
                          <MessageCircle size={18} />
                        </IconButton>
                      )}
                      {coach.telegram && (
                        <IconButton
                          size="small"
                          component="a"
                          href={coach.telegram.startsWith('http') ? coach.telegram : `https://t.me/${coach.telegram}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          sx={{
                            color: '#0088cc',
                            bgcolor: 'rgba(0, 136, 204, 0.1)',
                            '&:hover': { bgcolor: 'rgba(0, 136, 204, 0.2)' },
                          }}
                        >
                          <Send size={18} />
                        </IconButton>
                      )}
                    </Box>
                  </Box>
                )}
              </Box>
            </AccordionDetails>
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
};

export default CoachCard;
