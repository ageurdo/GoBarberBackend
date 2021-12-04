import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export default class AlterProviderFieldName1638636146049 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.dropColumn('appointments', 'provider');

        await queryRunner.addColumn('appointments', new TableColumn({
            name: 'provider_id',
            type: 'uuid',
            isNullable: true // Se o prestador de serviço for excluído o agendamento será mantido como histórico para o cliente, e apenas o prestador irá sumir do histórico. Caso contrário seria necessário excluir todos relacionamentos com agendamentos e outros caso tenham no futuro.
        }));

        await queryRunner.createForeignKey('appointments', new TableForeignKey({
            name: 'AppointmentProvider',
            columnNames: ['provider_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'SET NULL', // Caso o prestador de serviço for excluído as referências que utilizam o id dele, serão setadas como null
            onUpdate: 'CASCADE', // Caso o id do prestador seja alterado, em todos outros relacionamento também serão alterados
        }))

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey('appointments', 'AppointmentProvider');

        await queryRunner.dropColumn('appointments', 'provider_id');

        await queryRunner.addColumn('appointments', new TableColumn({
            name: 'provider',
            type: 'varchar',
        }));
    }

}
