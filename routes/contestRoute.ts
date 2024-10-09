import express from "express";
import prisma from "../auth";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const contests = await prisma.contest.findMany({});
    res.status(201).json({ contests });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get contest by ID
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const contest = await prisma.contest.findUnique({
      where: {
        id,
      },
    });
    if (contest) {
      res.status(201).json({ contest });
    }
    res.status(400).json({ message: "Contest not found" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Create a new contest
router.post("/", async (req, res) => {
  try {
    const {
      contestName,
      firstPrize,
      maxEntries,
      currentEntries,
      prizePool,
      entryFee,
      closingTime,
    } = req.body;
    const contest = await prisma.contest.create({
      data: {
        contestName,
        firstPrize: Number(firstPrize),
        maxEntries: Number(maxEntries),
        currentEntries: Number(currentEntries) || 0,
        prizePool: Number(prizePool),
        entryFee: Number(entryFee),
        closingTime: new Date(closingTime),
      },
    });
    res.status(201).json({ message: "Contest created successfully", contest });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update contest by ID
router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    let contest = await prisma.contest.findUnique({
      where: {
        id,
      },
    });
    if (contest) {
      const {
        contestName,
        firstPrize,
        maxEntries,
        currentEntries,
        prizePool,
        entryFee,
        closingTime,
      } = req.body;
      contest = await prisma.contest.update({
        where: {
          id,
        },
        data: {
          contestName,
          firstPrize: Number(firstPrize),
          maxEntries: Number(maxEntries),
          currentEntries: Number(currentEntries) || 0,
          prizePool: Number(prizePool),
          entryFee: Number(entryFee),
          closingTime: new Date(closingTime),
        },
      });
      res.status(201).json({message: 'Contest updated successfully', contest})
    }
    res.status(400).json({message: 'Contest not found'})
  } catch (error) {
    res.status(500).json({message: 'Internal server error'})
  }
});

// Delete contest by ID
router.delete("/:id", async(req, res) => {
    try {
        const id = Number(req.params.id);
        let contest = await prisma.contest.delete({
            where: {
                id
            },
        });
        if(contest){
            res.status(201).json({message: 'Contest deleted successfully', contest});
        }
        res.status(400).json({message: 'Contest not found'})
    } catch (error) {
        res.status(500).json({message: 'Internal server error'})
    }
});

router.put("/isActive/:id", async(req, res) => {
    try {
        const id = Number(req.params.id);
        let contest = await prisma.contest.findUnique({
            where: {
                id
            }
        });
        if(contest){
            const {isActive} = req.body
            contest = await prisma.contest.update({
                where: {
                    id
                },
                data: {
                    isActive
                }
            });
            res.status(201).json({message: 'Contest updated successfully'}); 
        }
        res.status(400).json({message: 'Contest not found'})
    } catch (error) {
        res.status(500).json({message: 'Internal server error'})
    }
});

export default router
