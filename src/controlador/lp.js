import { pool } from "../database.js";
import { Router } from "express";
const router = Router();

//Metodos HTTP
//Crud= Create, Read, Update, Delete
//GET, POST, PUT, DELETE
//Get: Read
//Post: Create
//Put/patch: Update
//Delete: Delete

router.get("/proveedores", async (req, res) => {
  try {
    const proveedores = await pool.query("SELECT * FROM proveedor");
    res.json(proveedores[0]);
  } catch (error) {
    res.json({ error: error });
  }
});

router.get("/proveedores/:id_proveedor", async (req, res) => {
  try {
    const { id_proveedor } = req.params;
    const proveedor = await pool.query(
      "SELECT * FROM proveedor WHERE id_proveedor = ?",
      [id_proveedor]
    );

    if (proveedor[0].length === 0) {
      return res.json({ mensaje: "Proveedor no encontrado" });
    }

    res.json(proveedor[0]);
  } catch (error) {
    res.json({ error: error });
  }
});

router.post("/proveedores", async (req, res) => {
  const { nombre, telefono, correo, direccion, avatar } = req.body;
  try {
    const proveedor = await pool.query(
      "INSERT INTO proveedor(nombre, telefono, correo, direccion, avatar) VALUES(?, ?, ?, ?, ?)",
      [nombre, telefono, correo, direccion, avatar]
    );
    res.json(proveedor);
  } catch (error) {}
});

export default router;

router.patch("/proveedores/:id_proveedor", async (req, res) => {
  const { id_proveedor } = req.params;
  const { nombre, telefono, correo, direccion, avatar } = req.body;
  try {
    const proveedor = await pool.query(
      "UPDATE proveedor SET nombre =  IFNULL(?, nombre), telefono = IFNULL(?, telefono), correo = IFNULL(?, correo), direccion = IFNULL(?, direccion), avatar = IFNULL(?, avatar) WHERE id_proveedor = ?",
      [nombre, telefono, correo, direccion, avatar, id_proveedor]
    );

    if (proveedor[0].affectedRows === 0) {
      return res.json({ mensaje: "Proveedor no encontrado" });
    }
    res.json({ mensaje: "Proveedor actualizado" });
  } catch (error) {
    res.json({ error: error });
  }
});

router.delete("/proveedores/:id_proveedor", async (req, res) => {
  const { id_proveedor } = req.params;
  try {
    const proveedor = await pool.query(
      "DELETE FROM proveedor WHERE id_proveedor = ?",
      [id_proveedor]
    );

    if (proveedor[0].affectedRows === 0) {
      return res.json({ mensaje: "Proveedor no encontrado" });
    }
    res.json({ mensaje: "Proveedor eliminado" });
  } catch (error) {
    res.json({ error: error });
  }
});

router.post("/lotes", async (req, res) => {
  const { vencimiento, stock, idProveedor, idProducto } = req.body;
  try {
    const lotes = await pool.query(
      `INSERT INTO lote(vencimiento, stock, id_proveedor, id_producto)VALUES (?, ?, ?, ?)`,
      [vencimiento, stock, idProveedor, idProducto]
    );
    res.json(lotes[0]);
  } catch (error) {
    res.json({
      message: "error" + error,
    });
  }
});

router.get("/agg", async (req, res) => {
  try {
    const [rows] =
      await pool.query(`SELECT L.id_lote AS id_lote, P.nombre AS nombre_producto, PR.nombre AS      nombre_proveedor, L.stock
        FROM lote L
        JOIN producto P ON L.id_producto = P.id_producto
        JOIN proveedor PR ON P.id_proveedor = PR.id_proveedor
        WHERE P.precio > 10000`);
    res.json(rows);
  } catch (error) {
    res.json({ error: error });
  }
});
