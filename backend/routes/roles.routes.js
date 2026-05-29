const express = require('express')

const router = express.Router()

const db = require('../db')

router.get('/', (req, res) => {

  const sql = `
    SELECT
      id_rol,
      nombre_rol
    FROM roles
    WHERE estado = 1
  `

  db.query(sql, (err, results) => {

    if (err) {
      return res.status(500).json(err)
    }

    res.json(results)

  })

})

module.exports = router