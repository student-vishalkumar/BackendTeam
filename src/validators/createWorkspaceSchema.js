import { z } from 'zod';

const createWorkspaceSchema = z.object({
    name: z.string().min(3).max(50)
})

export default createWorkspaceSchema;