import { Router } from "express";

const router = Router();

// Example route handlers (to be replaced with actual implementations)
router.get("/", (req, res) => {
  res.send("Get all posts");
});

router.post("/", (req, res) => {
  res.send("Create a new post");
});

router.get("/:id", (req, res) => {
  res.send(`Get post with ID: ${req.params.id}`);
});

export default router;