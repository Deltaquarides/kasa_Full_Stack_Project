/* 
 I. Here we want to calculate the average score of users votes 
in order to do so: we need to keep track of the number of votes as well
as the total score then the total of score is divided by the number of 
votes to calculate the average.
1. average = total score/ number of vote
2. voteCount: We introduced voteCount to track how many votes have been cast for the apartment.
3. voteCount field sould be add in the Joi schema
voteCount: number of users who have voted
totalVotes is the sum of the individual votes.
 
 II. We need to implement the feature where user's vote can be updated but not accumulated.
1. Add a voters field (joi) in the apartment, will store an array of user's ID who voted.
2.Check if the user have already voted. If yes update their previous vote. If not add their vote and add thei ID.
3. Adjust the calculation of likes and voteCount by replacing their previous votes with the next ones.
*/

const {
  readFilePromise,
  writeFilePromise,
} = require("../controllers/host/hostPromiseFs");

exports.userLike = (req, res, next) => {
  const id = req.params.id; // id of the apartment;
  const vote = req.body.likes; // // the like value can be between 0 to 5
  //const userId = req.auth.userId; // user Id from JWT which is an object.req.auth = {userId: userId,};

  // Check if the vote is a valid value between 0 and 5
  if (vote < 0 || vote > 5) {
    return res.status(400).json({
      message: "Invalid vote value. Use 1 for like or -1 for dislike.",
    });
  }

  readFilePromise(res)
    .then((apartmentsData) => {
      // Find the apartment by its ID
      const apartmentToVote = apartmentsData.find(
        (apartment) => apartment.id === id
      );

      // Check if apartment exists
      if (!apartmentToVote) {
        return res.status(404).json({ message: "Apartment not found" });
      }
      // Initialize voteCount and voters array if not defined
      if (
        apartmentToVote.voteCount === undefined ||
        apartmentToVote.voteCount === null
      ) {
        apartmentToVote.voteCount = 0; // Initialize vote count to 0 if undefined
      }

      // Initialize the voters array if not already defined
      if (!apartmentToVote.voters) {
        apartmentToVote.voters = []; // Initialize voters array if not defined
      }

      // Check in the array if the user has already voted with  findIndex method
      // If no elements satisfy the testing function, -1 is returned.
      const existingVoteIndex = apartmentToVote.voters.findIndex(
        (voter) => voter.userId === userId
      );
      console.log("THIS IS THE existingVoteIndex", existingVoteIndex);

      if (existingVoteIndex !== -1) {
        // Update the vote in the array
        apartmentToVote.voters[existingVoteIndex].vote = vote;
      } else {
        // User has not voted, add their vote
        //apartmentToVote.votes = apartmentToVote.votes + vote
        // "apartmentToVote.votes + vote"; adds the current votes to the vote the user submitted.
        // "apartmentToVote.votes ="the result is assigned back to apartmentToVote.votes, updating the vote count.
        apartmentToVote.voteCount += 1; // Increment the vote count

        // Add the user's vote to the voters array
        apartmentToVote.voters.push({ userId, vote });

        console.log("User's vote added.");
      }

      // Calculate the total score (vote) from the voters array
      const totalVotes = apartmentToVote.voters.reduce(
        (sum, voter) => sum + voter.vote,
        0
      );
      const averageVote = totalVotes / apartmentToVote.voteCount;
      // Set the averageVote in the apartment object
      apartmentToVote.averageVote = averageVote;

      console.log("Calculated averageVote:", averageVote);
      console.log(totalVotes);
      console.log(apartmentToVote.voteCount);
      console.log(vote);

      return writeFilePromise(apartmentsData).then(() => {
        // Optionally, we can return the updated apartment data
        return res.status(200).json({
          message: "Vote successfully recorded.",
          apartment: apartmentToVote,
          averageVote: averageVote,
        });
      });
    })
    .catch((error) => {
      return res.status(500).json({
        message: "An error occurred while processing the vote.",
        error: error.message,
      });
    });
};
