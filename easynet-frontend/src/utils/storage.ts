// src/utils/storage.ts

interface Script {
    id: string;
    name: string;
    content: string;
  }
  
  const SCRIPTS_KEY = 'scripts_db';
  
  export const getScripts = (): Script[] => {
    const scripts = localStorage.getItem(SCRIPTS_KEY);
    return scripts ? JSON.parse(scripts) : [];
  };
  
  export const saveScripts = (scripts: Script[]) => {
    localStorage.setItem(SCRIPTS_KEY, JSON.stringify(scripts));
  };
  
  export const addScript = (newScript: Script) => {
    const scripts = getScripts();
    scripts.push(newScript);
    saveScripts(scripts);
  };
  
  export const updateScript = (updatedScript: Script) => {
    const scripts = getScripts().map(script =>
      script.id === updatedScript.id ? updatedScript : script
    );
    saveScripts(scripts);
  };
  
  export const deleteScript = (id: string) => {
    const scripts = getScripts().filter(script => script.id !== id);
    saveScripts(scripts);
  };
  