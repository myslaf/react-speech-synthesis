import { useCallback, useEffect, useState } from "react";
import { Select } from "semantic-ui-react";

type VoiceSelectorProps = {
  selected: number;
  setSelected: (selectedIndex: number) => void;
};

const synth = window.speechSynthesis;

export const VoiceSelector = ({
  selected = 0,
  setSelected,
}: VoiceSelectorProps) => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  const populateVoiceList = useCallback(() => {
    const newVoices = synth.getVoices();
    setVoices(newVoices);
  }, []);

  useEffect(() => {
    populateVoiceList();
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = populateVoiceList;
    }
  }, [populateVoiceList]);

  return (
    <Select
      value={selected}
      onChange={(e, data) => {
        setSelected(data.value as number);
      }}
      placeholder="Wybierz głos"
      options={voices
        .filter((voice) => voice.lang.includes("pl"))
        .map((voice, index) => ({
          key: index,
          value: index,
          text: `${voice.name} (${voice.lang}) ${
            voice.default ? " [Domyślny]" : ""
          }`,
        }))}
    >
    </Select>
  );
};
