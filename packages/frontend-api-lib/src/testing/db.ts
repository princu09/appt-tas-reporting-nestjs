import { exec } from 'child_process';
import { promisify } from 'util';
const execPromise = promisify(exec);

export async function resetDB() {
	try {
		await execPromise('cat newDump.sql | docker exec -i flytt-frontend-api-db psql -U postgres')
	} catch (err) {
		console.log(err)
	}
}