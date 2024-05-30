const express = require("express");
const morgan = require("morgan");
const app = express();

const { quotes } = require("./data");
const { getRandomElement, getIndexById } = require("./utils");
//set server to port 4001
const PORT = process.env.PORT || 4001;

app.use(express.static("public"));
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
//get single quote route
app.get("/api/quotes/random", (req, res, next) => {
  const randQuote = getRandomElement(quotes);
  if (randQuote) {
    res.send({ quote: randQuote });
  } else {
    res.status(404).send();
  }
});

//route for getting all quotes:
app.get("/api/quotes", (req, res, next) => {
  const quoteFilter = quotes.filter(author => {
    return author.person === req.query.person;
  });
  if (req.query.person) {
    res.send({ quotes: quoteFilter });
  } else {
    res.send({ quotes: quotes });
  }
});
//post method for new quotes:
app.post("/api/quotes", (req, res, next) => {
  const newQuote = req.query.quote;
  const newPerson = req.query.person;
  if (newQuote != '' && newPerson != '') {
    quotes.push({quote: newQuote, person: newPerson});
    res.send({quote: {quote: newQuote, person: newPerson}})
  } else {
    res.status(400).send();
  }
});

app.delete("/:id", (req, res) => {
  const quoteId = getIndexById(req.param.id, quotes);
  if (quoteId !== -1) {
    quotes.splice(quoteId, 1);
    res.static(204).send();
  } else {res.status(404).send()}
})
