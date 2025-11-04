import React from 'react';
import { Box, Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';

/**
 * BetaInfoContent - Sdílená komponenta pro zobrazení beta informací
 *
 * Props:
 * - variant: 'slide' | 'banner' | 'dialog' | 'full'
 * - data: object s obsahem (z betaInfo.js)
 *
 * @created 4.11.2025
 */
const BetaInfoContent = ({ variant = 'dialog', data }) => {
  if (!data) return null;

  // Variant: Onboarding Slide
  if (variant === 'slide') {
    return (
      <Box textAlign="center" py={2}>
        <Typography variant="h2" sx={{ fontSize: '3rem', mb: 2 }}>
          {data.emoji}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
          {data.title}
        </Typography>
        {data.content && (
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {data.content}
          </Typography>
        )}
        {data.steps && (
          <List sx={{ textAlign: 'left', maxWidth: 400, mx: 'auto' }}>
            {data.steps.map((step, index) => (
              <ListItem key={index} sx={{ py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <Typography variant="h6" color="primary.main">
                    {index + 1}.
                  </Typography>
                </ListItemIcon>
                <ListItemText primary={step} />
              </ListItem>
            ))}
          </List>
        )}
        {data.limits && (
          <List sx={{ textAlign: 'left', maxWidth: 400, mx: 'auto' }}>
            {data.limits.map((limit, index) => (
              <ListItem key={index} sx={{ py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <CheckCircle color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={limit} />
              </ListItem>
            ))}
          </List>
        )}
        {data.footer && (
          <Box mt={3}>
            <Typography variant="body2" color="text.secondary" mb={0.5}>
              {data.footer}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 600,
                color: 'primary.main',
              }}
            >
              {data.contact}
            </Typography>
          </Box>
        )}
      </Box>
    );
  }

  // Variant: Welcome Banner
  if (variant === 'banner') {
    return (
      <Box>
        <Box display="flex" alignItems="center" gap={1.5} mb={2}>
          <Typography variant="h4">{data.emoji}</Typography>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {data.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {data.subtitle}
            </Typography>
          </Box>
        </Box>

        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3}>
          <Box flex={1}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              ✨ Co funguje:
            </Typography>
            <List dense>
              {data.features.map((feature, index) => (
                <ListItem key={index} sx={{ py: 0.25 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckCircle color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={feature}
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>

          <Box flex={1}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              📝 Co testujeme:
            </Typography>
            <List dense>
              {data.testing.map((test, index) => (
                <ListItem key={index} sx={{ py: 0.25 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckCircle color="secondary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={test}
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>

        <Box mt={2}>
          <Typography variant="body2" color="text.secondary">
            {data.security}
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
            {data.contactPrompt}{' '}
            <Typography
              component="span"
              sx={{ fontWeight: 600, color: 'primary.main' }}
            >
              {data.contactEmail}
            </Typography>
          </Typography>
        </Box>
      </Box>
    );
  }

  // Variant: Beta Badge Dialog
  if (variant === 'dialog') {
    return (
      <Box>
        <Box display="flex" alignItems="center" gap={1.5} mb={2}>
          <Typography variant="h3">{data.emoji}</Typography>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {data.title}
          </Typography>
        </Box>

        <Typography variant="body1" mb={3}>
          {data.intro}
        </Typography>

        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
          {data.limitsTitle}
        </Typography>
        <List>
          {data.limits.map((limit, index) => (
            <ListItem key={index} sx={{ py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <CheckCircle color="primary" fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={limit} />
            </ListItem>
          ))}
        </List>

        <Typography variant="body1" mt={2} mb={2}>
          {data.thankYou}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            color: 'primary.main',
          }}
        >
          {data.contact}
        </Typography>
      </Box>
    );
  }

  // Variant: Full Info (pro Profil/Nastavení)
  if (variant === 'full') {
    return (
      <Box>
        {data.sections.map((section, index) => (
          <Box key={index} mb={4}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              {section.title}
            </Typography>
            {section.content && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ whiteSpace: 'pre-line' }}
              >
                {section.content}
              </Typography>
            )}
            {section.items && (
              <List>
                {section.items.map((item, itemIndex) => (
                  <ListItem key={itemIndex} sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <CheckCircle color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={item}
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        ))}
      </Box>
    );
  }

  return null;
};

export default BetaInfoContent;
