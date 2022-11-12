import express from "express";
import { auth } from "../middlewares/auth.js";
import * as raceUseCase from "../useCase/race.use.js";
import * as UserUseCase from "../useCase/user.use.js";
import * as raceRequestUseCase from "../useCase/raceRequest.use.js";
import * as commentUseCase from "../useCase/comment.use.js";

const router = express.Router();
router.use(express.json());

router.post("/", auth, async (request, response, next) => {
  try {
    const { body: newDataRace, auth: id } = request;
    const newRace = await raceUseCase.create(newDataRace, id);

    await UserUseCase.addRace(id, newRace.id);

    response.json({
      success: true,
      data: {
        race: newRace,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get("/all", async (request, response, next) => {
  try {
    const allRaces = await raceUseCase.getAll();
    response.json({
      success: true,
      data: {
        races: allRaces,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get("/me", auth, async (request, response, next) => {
  try {
    const { auth: id } = request;
    const racesCreated = await raceUseCase.getByUser(id);
    const racesAssisted = await raceUseCase.getByAssistant(id);
    response.json({
      success: true,
      data: {
        racesCreated: racesCreated,
        racesAssisted: racesAssisted,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get("/user/:idUser", async (request, response, next) => {
  try {
    const id = request.params.idUser;
    const racesCreated = await raceUseCase.getByUser(id);
    const racesAssisted = await raceUseCase.getByAssistant(id);
    response.json({
      success: true,
      data: {
        racesCreated: racesCreated,
        racesAssisted: racesAssisted,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get("/dashboard", auth, async (request, response, next) => {
  try {
    const { auth: id } = request;
    const location = "";
    const race = await raceUseCase.getByLocation(location, id);
    response.json({
      success: true,
      data: {
        races: race,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:idRace", async (request, response, next) => {
  try {
    const { idRace: id } = request.params;
    const race = await raceUseCase.getById(id);
    response.json({
      success: true,
      data: {
        race: race,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/:idRace", auth, async (request, response, next) => {
  try {
    const { idRace } = request.params;
    const { auth: idUser } = request;
    const newDataRace = request.body;
    const updatedRace = await raceUseCase.update(idRace, idUser, newDataRace);

    response.json({
      success: true,
      data: {
        race: updatedRace,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:idRace", auth, async (request, response, next) => {
  try {
    const { idRace } = request.params;
    const { auth: idUser } = request;
    const race = await raceUseCase.deleteById(idRace, idUser);
    await UserUseCase.deleteRace(idUser, idRace);
    const comments = await commentUseCase.deleteByRace(idRace);
    const deleteRR = await raceRequestUseCase.deleteByRace(idRace);
    deleteRR.forEach(async (raceReq) => {
      await UserUseCase.deleteManyRacesRequests(idUser, raceReq.id);
    });
    response.json({
      success: true,
      race: race,
      comments: comments,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
