const { Pool } = require("pg");
const config = require("../../config");
const pool = new Pool(config);

const getAllDocuments = () => {
  return new Promise((resolve, reject) => {
    const sqlQuery =
      "select\
          d.id, d.format, d.name,\
          d.status, d.submission_date, d.due_date,\
          lf.name as from_language_name,\
          lt.name as to_language_name,\
          u.name as owner_name\
      from documents as d\
      inner join languages as lf\
      on  lf.code = d.from_language_code\
      inner join languages as lt\
      on lt.code = d.to_language_code\
      inner join users as u\
      on u.id = d.owner_id;";

    pool.query(sqlQuery, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result.rows);
      }
    });
  });
};

const getUserDocuments = userId => {
  const documents = "SELECT * FROM documents WHERE owner_id=$1";
  return new Promise((resolve, reject) => {
    pool.query(documents, [userId], (error, result) => {
      if (error) {
        reject(error);
      }

      resolve(result.rows);
    });
  });
};

const getDocumentById = documentId => {
  const sqlQuery = `select
  d.name,
    d.status, d.submission_date, d.due_date,
    lf.name as from_language_name,
    lt.name as to_language_name,
    u.name as owner_name,
    d.content
  from documents as d
  inner join languages as lf
  on  lf.code = d.from_language_code
  inner join languages as lt
  on lt.code = d.to_language_code
  inner join users as u
  on u.id = d.owner_id
  where d.id = $1`;
  return pool
    .query(sqlQuery, [documentId])
    .then(result => result.rows)
    .catch(e => console.error(e));
};

module.exports = {
  getAllDocuments,
  getUserDocuments,
  getDocumentById
};
