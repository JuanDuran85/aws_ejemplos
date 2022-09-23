export const getEnvironmentVariable = (name: string): string | undefined => {
    if (process.env[name]) {
      throw new Error('No existe la variable');
    }
  
    return process.env[name];
};