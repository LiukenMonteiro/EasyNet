import React, { useEffect, useState } from 'react';

interface Script {
  id: string;
  device: string;
  commands: string[];
}

const ListarScripts: React.FC = () => {
  const [scripts, setScripts] = useState<Script[]>([]);

  useEffect(() => {
    const fetchScripts = async () => {
      const response = await fetch('http://localhost:3000/script');
      const data = await response.json();
      setScripts(data);
    };

    fetchScripts();
  }, []);

  return (
    <ul>
      {scripts.map((script) => (
        <li key={script.id}>
          <h3>{script.device}</h3>
          <p>{script.commands.join(', ')}</p>
          <a href={`http://localhost:3000/script/download/${script.id}`}>Baixar PDF</a>
        </li>
      ))}
    </ul>
  );
};

export default ListarScripts;
