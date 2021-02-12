const { BadRequestError } = require("../expressError");

/**
 * The calling function can use it to make the SET clause of an SQL UPDATE
 * statement.
  // {firstName: 'James', age: 32} => ['"first_name"=$1', '"age"=$2']
*/

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };
