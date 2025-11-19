export const getEnvVariables = () => {
  return {
    VITE_MOCK_DELAY: Number(import.meta.env.VITE_MOCK_DELAY) || 400,
  };
};