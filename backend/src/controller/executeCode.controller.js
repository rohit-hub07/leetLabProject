import { pollBatchResults, submitBatch } from "../libs/judge0.lib.js";

export const executeCode = async (req, res) => {
  try {
    // console.log("inside execution controller")

    const { source_code, language_id, stdin, expected_outputs, problemId } = req.body;
    const userId = req.user.id;
    //Validate the test cases
    if(
      !Array.isArray(stdin) ||
      stdin.length === 0 || !Array.isArray(expected_outputs) ||
      expected_outputs.length === 0 ||expected_outputs.length !== stdin.length
    ){
      return res.status(400).json({
        success: false,
        error: "Invalid test cases",
      });
    }
    // Prepare each test cases for judge 0 batch submission
    
    const submission = stdin.map((input) => ({
      source_code,
      language_id,
      stdin: input,
    }));
    // Send this batch submission to judge 0

    const submitResponse = await submitBatch(submission);
    
    const tokens = submitResponse.map((response) => response.token);
    // Poll judge0 for all the submistted test cases;

    const results =await pollBatchResults(tokens);

    console.log('Results-----------');
    console.log(results);

    res.status(200).json({
      success: true,
      message: "Code executed successfully",
      data: results,
    });

  } catch (error) {
    
  }
}