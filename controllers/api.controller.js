const endpointsJson = require(`${__dirname}/../endpoints.json`);

exports.getApi = (req, res, next) => {
  res.status(200).send({ endpoints: endpointsJson });
};
