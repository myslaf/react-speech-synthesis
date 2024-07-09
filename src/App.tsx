import { FormEvent, useCallback, useEffect, useState } from "react";
import { VoiceSelector } from "./components/VoiceSelector";
import { Button, Form, FormInput, Container } from "semantic-ui-react";
import { useActiveElement } from "./hooks/useActiveElement";
import "./App.scss";

const synth = window.speechSynthesis;

function App() {
  const [textValue, setTextValue] = useState<string>("");
  const [selectedVoice, setSelectedVoice] = useState<number>(0);
  const focusedElement = useActiveElement();

  const speak = useCallback(
    (e?: FormEvent<HTMLFormElement>) => {
      e?.preventDefault();

      const utterance = new SpeechSynthesisUtterance(textValue);
      utterance.voice = synth
        .getVoices()
        .filter((voice) => voice.lang.includes("pl"))[selectedVoice];

      synth?.speak(utterance);
    },
    [textValue, selectedVoice]
  );

  useEffect(() => {
    if (typeof textValue === "string" && textValue.length > 0) {
      speak();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textValue]);

  useEffect(() => {
    console.log("focusedElement: ", focusedElement);
    synth?.cancel();
    if (!focusedElement) return;
    switch (focusedElement.tagName.toLowerCase()) {
      case "p":
      case "button":
        setTextValue((focusedElement as HTMLButtonElement).innerHTML);
        break;
      default:
        break;
    }
  }, [focusedElement]);

  if (!synth)
    return <span>Your browser does not support Speech Synthesis</span>;

  return (
    <Container className="app-container">
      <div className="focused-items">
        <Button>
          Test 1 - badzo długi tekst do przeczytania dla przycisku 1
        </Button>
        <Button>
          Test 2 - badzo długi tekst do przeczytania dla przycisku 2
        </Button>
        <Button>
          Test 3 - badzo długi tekst do przeczytania dla przycisku 3
        </Button>
        <p tabIndex={4} aria-label="Text numer 1 - badzo długi tekst do przeczytania dla tekstu 1">
          Text numer 1 - badzo długi tekst do przeczytania dla tekstu 1
        </p>
      </div>
      <Form onSubmit={speak}>
        <FormInput
          label="Wprowadź tekst do przeczytania"
          type="text"
          onChange={(e) => setTextValue(e.target.value)}
        />
        <VoiceSelector
          selected={selectedVoice}
          setSelected={setSelectedVoice}
        />
        <div className="buttons">
          <Button type="submit">Czytaj</Button>
        </div>
      </Form>
    </Container>
  );
}

export default App;
