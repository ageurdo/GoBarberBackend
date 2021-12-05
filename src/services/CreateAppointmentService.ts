import { startOfHour } from 'date-fns';
import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';
import { getCustomRepository } from 'typeorm';
import appointmentsRouter from '../routes/appointments.routes';
import AppError from '../errors/AppErrors'

interface Request {
    date: Date,
    provider_id: string
}


class CreateAppointmentService {

    public async execute({ provider_id, date }: Request): Promise<Appointment> {
        const appointmentsRepository = getCustomRepository(AppointmentsRepository);

        const appointmentDate = startOfHour(date)

        const findAppointmentSameDate = await appointmentsRepository.findByDate(appointmentDate);

        if (findAppointmentSameDate) {
            throw new AppError('This appointment is already booked');
        }

        const appointment = appointmentsRepository.create({
            provider_id: provider_id, // verificar
            date: appointmentDate
        });

        await appointmentsRepository.save(appointment)

        return appointment;
    }

}

export default CreateAppointmentService;
