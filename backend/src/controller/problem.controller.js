import { db } from "../libs/db.js";
import {
  getJudge0LanguageId,
  submitBatch,
  pollBatchResults,
} from "../libs/judge0.lib.js";

export const createProblem = async (req, res) => {
  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    testcases,
    codeSnippet,
    referenceSolutions,
  } = req.body;

  //check user role
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({
      error: "You are not allowed to create a problem",
    });
  }

  try {
    //Seoarating language and code
    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
    // here we are passing the language to get the id of the language
      const languageId = getJudge0LanguageId(language);

      if (!languageId) {
        return res.status(400).json({
          error: `Language ${language} is not supported!`,
        });
      }
      const submissions = testcases.map(({ input, output }) => ({
        source_code: solutionCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));
      // console.log("Error before hitting submitBatch method")

      const submissionResults = await submitBatch(submissions);
      // console.log("Error after hitting submitBatch method")


      const tokens = submissionResults.map((rs) => rs.token);
      
      console.log("tokens of create problem",tokens)

      const results = await pollBatchResults(tokens);

      for (let i = 0; i < results.length; i++) {
        const result = results[i];

        if (result.status.id !== 3) {
          return res.status(400).json({
            error: `Testcase ${i + 1} failed for language ${language}`,
          });
        }
      }
    }
    //save
    const newProblem = await db.problem.create({
      data: {
        title,
        description,
        difficulty,
        tags,
        examples,
        constraints,
        testcases,
        codeSnippet,
        referenceSolutions,
        userId: req.user.id,
      },
    });
    res.status(201).json({
      message: "New problem created",
      problem: newProblem
    });
  } catch (error) {
    return res.status(400).json({
      error: "Error while creating problem"
    })
  }
};

export const getAllProblems = async (req, res) => {
  try {
    
  } catch (error) {
    
  }
};

export const getProblemById = async (req, res) => {};

export const updateProblem = async (req, res) => {};

export const deleteProblem = async (req, res) => {};

export const getAllProblemsSolvedBysUser = async (req, res) => {};
