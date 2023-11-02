import { useState, useEffect } from "react";
import { SCORM } from "pipwerks-scorm-api-wrapper";

export const ScormHandler = () => {
  const [score, setScore] = useState("100");
  const [shouldQuit, setShouldQuit] = useState(false);

  useEffect(() => {
    SCORM.init();
    // Se añade obtener el masteryscore en caso de que sea necesario.
    const masteryScore = SCORM.get("cmi.student_data.mastery_score");
    console.log("masteryScore", masteryScore);
    setMasteryScore(masteryScore);
    return () => {
      SCORM.quit();
    };
  }, []);

  // Estado para almacenar el masteryScore.
  const [masteryScore, setMasteryScore] = useState(null);

  const handleSendScore = () => {
    const numericScore = parseInt(score, 10);
    if (!isNaN(numericScore)) {
      SCORM.set("cmi.core.score.raw", numericScore.toString());

      // Comprobar contra el masteryScore, si existe.
      let status = "completed";
      if (masteryScore && numericScore >= parseInt(masteryScore, 10)) {
        status = "passed";
      } else if (masteryScore) {
        status = "failed";
      }

      SCORM.set("cmi.core.lesson_status", status);
      SCORM.save();
      if (shouldQuit) {
        SCORM.quit();
      }
    } else {
      alert("Por favor, ingrese un puntaje válido.");
    }
  };

  return (
    <div>
      <input
        type="text"
        value={score}
        onChange={(e) => setScore(e.target.value)}
        placeholder="Ingrese el puntaje"
      />
      <button onClick={handleSendScore}>Enviar puntaje</button>
      <label>
        <input
          type="checkbox"
          checked={shouldQuit}
          onChange={(e) => setShouldQuit(e.target.checked)}
        />
        ¿Hacer quit después de enviar el puntaje?
      </label>
    </div>
  );
};
