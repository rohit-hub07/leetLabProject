import axios from 'axios'

export const getJudge0LanguageId = (language) => {
  const languageMap = {
    PYTHON: 71,
    JAVA: 62,
    JAVASCRIPT: 63,
  };
  return languageMap[language.toUpperCase()] || null;
};

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const pollBatchResults = async(tokens) => {
  while(true){
    const { data } = await axios.get(`${process.env.JUDGE0_API_URL}/submissions/batch`,{
      params:{
        tokens: tokens.join(","),
        nase64_encoded: false,
      }
    })

    console.log(` Data inside of pollBatchResults ${data}`)

    const results = data.submissions;
    const isAllDone = results.every((r) => r.status.id !== 1 && r.status.id !==2);

    console.log("Results of pollBatchResults", results)

    console.log(`Valus of isAllDone inside of pollBatchResults ${isAllDone}`)

    if(isAllDone){
      return results;
    }
    await sleep(1000)
  }
}

export const submitBatch = async (submissions) => {
  const {data} = await axios.post(`${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`,{
    submissions
})

  console.log("Submission Results: ",data);
  return data;
}
