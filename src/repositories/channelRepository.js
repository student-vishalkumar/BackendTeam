

import Channel from "../Schema/channel.js";
import crudRepository from "./crudRepository.js";

const channelRepository = {
    ...crudRepository(Channel)
}

export default channelRepository;