import axios from "axios";

class VideoMeetingController {
  async createRoom(req, res, next) {
    try {
      const meteredDomain = process.env.METERED_DOMAIN;
      const meteredSecretKey = process.env.METERED_SECRET_KEY;

      const url = `https://${meteredDomain}/api/v1/room/?secretKey=${meteredSecretKey}`;

      const createdRom = await axios.post(url).catch((error) => {
        if (error.response) {
          const { message } = error.response.data;
          throw new Error(message);
        }
      });

      if (!createdRom) throw new Error("Error with video meeting API !");

      const { roomName } = createdRom.data;
      return res.status(200).json({
        message: "SUCCES",
        roomName,
      });
    } catch (e) {
      next(e);
    }
  }
  async validateRoom(req, res, next) {
    try {
      const { roomName } = req.query;
      if (!roomName)
        throw new Error("You need to include roomName in your request !");
      const meteredDomain = process.env.METERED_DOMAIN;
      const meteredSecretKey = process.env.METERED_SECRET_KEY;
      const url = `https://${meteredDomain}/api/v1/room/${roomName}?secretKey=${meteredSecretKey}`;
      const response = await axios.get(url);
      if ("roomName" in response.data)
        return res.status(200).json({ roomFound: true });
      return res.status(404).json({ roomFound: false });
    } catch (e) {
      next(e);
    }
  }

  async getMeteredDomain(req, res, next) {
    try {
      const meteredDomain = process.env.METERED_DOMAIN;

      return res.status(200).json({ meteredDomain });
    } catch (e) {
      next(e);
    }
  }

  async removeRoom(req, res, next) {
    try {
      const { roomName } = req.body;
      const meteredDomain = process.env.METERED_DOMAIN;
      const meteredSecretKey = process.env.METERED_SECRET_KEY;

      const url = `https://${meteredDomain}/api/v1/room/${roomName}?secretKey=${meteredSecretKey}`;
      const response = await axios.delete(url).catch((error) => {
        if (error.response) {
          const { message } = error.response.data;
          throw new Error(message);
        }
      });
      if (response.status === 200) {
        const { message } = response.data;
        return res.status(200).json({
          status: "SUCCESS",
          message,
        });
      }
    } catch (e) {
      next(e);
    }
  }
}

export const VideoMeetingControllerInstance = new VideoMeetingController();
