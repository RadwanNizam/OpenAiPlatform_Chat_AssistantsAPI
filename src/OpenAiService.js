import axios from 'axios';
import OpenAI from "openai";

const API_KEY = '';
const API_URL = 'https://api.openai.com/v1/assistants/chat';



const openai = new OpenAI({
    apiKey: API_KEY,
    dangerouslyAllowBrowser: true
});



export const fetchOpenAIResponse = async (prompt, setResponse, setReferences) => {
  let assistant_id= '';

  const thread = await openai.beta.threads.create({
    messages: [
      {
        "role": "user",
        "content": [
            {
              "type": "text",
              "text": prompt
            }
        ]
      }
    ]
  });

  console.log(JSON.stringify(thread));

  const stream = openai.beta.threads.runs
  .stream(thread.id, {
    assistant_id: assistant_id,
  })
  .on("textCreated", () => console.log("assistant >"))
  .on("toolCallCreated", (event) => console.log("assistant " + event.type))
  .on("messageDone", async (event) => {
    if (event.content[0].type === "text") {
      const { text } = event.content[0];
      const { annotations } = text;
      const citations = [];

      let index = 0;
      for (let annotation of annotations) {
        text.value = text.value.replace(annotation.text, "[" + index + "]");
        const { file_citation } = annotation;
        if (file_citation) {
          const citedFile = await openai.files.retrieve(file_citation.file_id);
          citations.push("[" + index + "]" + citedFile.filename);
        }
        index++;
      }

      setResponse(text.value);
      console.log(text.value);
      setReferences(citations.join("\n"))
      console.log(citations.join("\n"));
      return text.value;
    }
  });    
};