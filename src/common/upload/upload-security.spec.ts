import { requireUploadedFile, sanitizeMediaFolder } from './upload-security';

describe('upload-security', () => {
  describe('sanitizeMediaFolder', () => {
    it('converts a folder name to a safe slug', () => {
      expect(sanitizeMediaFolder('  Clinical Research & Reports  ')).toBe(
        'clinical-research-reports',
      );
    });

    it('removes long boundary hyphen sequences safely', () => {
      const unsafeFolder = `${'-'.repeat(10000)}media-library${'-'.repeat(
        10000,
      )}`;

      expect(sanitizeMediaFolder(unsafeFolder)).toBe('media-library');
    });

    it('limits folder names to 50 characters', () => {
      expect(sanitizeMediaFolder('a'.repeat(100))).toHaveLength(50);
    });

    it('returns general for empty or unusable values', () => {
      expect(sanitizeMediaFolder()).toBe('general');
      expect(sanitizeMediaFolder('---')).toBe('general');
      expect(sanitizeMediaFolder('   ')).toBe('general');
    });
  });

  describe('requireUploadedFile', () => {
    it('returns the provided file', () => {
      const file = {
        filename: 'example.png',
      } as Express.Multer.File;

      expect(requireUploadedFile(file)).toBe(file);
    });

    it('throws when no file is supplied', () => {
      expect(() => requireUploadedFile(undefined)).toThrow('File is required.');
    });
  });
});
