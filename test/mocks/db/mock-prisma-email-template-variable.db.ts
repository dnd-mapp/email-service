import { MockEmailTemplateVariableDB } from '@/email-template-variable/test';

export class MockPrismaEmailTemplateVariableDB {
    constructor(private readonly db: MockEmailTemplateVariableDB) {}

    public async findMany(params?: { where?: { templateId?: string } }) {
        const templateId = params?.where?.templateId;
        const records = templateId !== undefined ? this.db.getAllByTemplateId(templateId) : this.db.getAll();
        return await Promise.resolve(records);
    }

    public async findUnique(params: {
        where: { id?: string; templateId_name?: { templateId: string; name: string } };
    }) {
        const { where } = params;
        let record = null;

        if (where.id !== undefined) {
            record = this.db.getById(where.id);
        } else if (where.templateId_name !== undefined) {
            record = this.db.getByNameAndTemplateId(where.templateId_name.name, where.templateId_name.templateId);
        }

        return await Promise.resolve(record);
    }

    public async create(params: { data: { name: string; templateId: string } }) {
        const record = this.db.add(params.data.name, params.data.templateId);
        return await Promise.resolve(record);
    }

    public async update(params: { where: { id: string }; data: { name?: string } }) {
        const record = this.db.update(params.where.id, params.data);
        return await Promise.resolve(record!);
    }

    public async delete(params: { where: { id: string } }) {
        this.db.remove(params.where.id);
        return await Promise.resolve();
    }
}
