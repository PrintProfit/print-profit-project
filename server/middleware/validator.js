// This is just a transpiled version of some middleware I wrote in TypeScript,
// so I'm not including any ts-check comments.

export function validate(schema) {
  return async (req, res, next) => {
    try {
      const { params, body, query } = await schema.parseAsync({
        params: req.params,
        body: req.body,
        query: req.query,
      });
      req.params = params;
      req.body = body;
      req.query = query;
      return next();
    } catch (error) {
      return res.status(400).json({ error });
    }
  };
}
