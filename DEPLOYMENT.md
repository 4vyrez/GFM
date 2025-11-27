# Vercel Deployment

## Build Configuration

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## Environment Variables

No environment variables needed for V1.

## Git Integration

The Vercel project (ID: `prj_fNbDq5pteUuftsHF13iXxYxwEeCS`) is configured to auto-deploy from the Git repository.

## Deployment Steps

1. Commit all changes to Git
2. Push to the main branch
3. Vercel will automatically build and deploy
4. Verify the deployed site at the Vercel URL

## Post-Deployment

- Test on mobile devices
- Verify localStorage persists across sessions
- Check that minigame appears on streak day 3, 6, 9, etc.
