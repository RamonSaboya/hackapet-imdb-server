// ------------------------- DEV --------------------------
const NODE_ENV = process.env.NODE_ENV;
if (NODE_ENV && NODE_ENV !== 'production') {
    console.log('Loading .env file.');
    require('dotenv').load();
    console.log('.env file loaded successfully');
	console.log();
};


// -------------------- Express server --------------------
const express = require('express');
const app = express();
const body_parser = require('body-parser');
// defaults to 6666
const port = process.env.PORT || 6666;
const router = express.Router();

app.use(body_parser.urlencoded({ extended: true }));
app.use(body_parser.json());


// ---------------------- Constants -----------------------
const JSON_ERROR = {
	error: "Something went wrong. We're very sorry."
};


// ----------------------- Utility ------------------------
const parse_title = (text) => {
	return text.replace("_", " ");
}

const search_omdb = (req, res) => {
	const omdb_api = require('omdb-client');
	
	let title = req.body.title;
	if (!title) {
		title = req.params.title;
	}
	
	const params = {
		apiKey: process.env.API_KEY,
		title: parse_title(title),
	};
	
	omdb_api.get(params, function(error, result) {
		if (error) {
			res.status(500).json(JSON_ERROR);
		} else {
			res.status(200).send(result);
		}
	});
}


// -------------------- Initialization --------------------
router.get("/:title", search_omdb);
router.post("/", search_omdb);

app.use('/search', router);

app.listen(port);

console.log('Express server running on port ' + port);
