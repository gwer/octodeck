import { OctodeckModes } from '../../../components/OctodeckModes';
import { SlidesList } from '../../../components/SlidesList';
import { Octostore } from '../../../lib/octostore';

const initialData = await Octostore.getData();
const app = document.getElementById('app')!;

const modes = new OctodeckModes({ currentMode: 'view' });
app.appendChild(modes);

const slides = new SlidesList({
  rawData: initialData || '',
});

app.appendChild(slides);
