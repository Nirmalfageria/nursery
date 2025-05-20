import dbconnect from '../../../../db/index';
import Pot from '../../../../models/pots.model';

export async function GET(request, { params }) {
  await dbconnect();
  try {
    const pot = await Pot.findById(params.id);
    if (!pot) {
      return Response.json({ error: 'Pot not found' }, { status: 404 });
    }
    return Response.json(pot);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch pot' }, { status: 500 });
  }
}
