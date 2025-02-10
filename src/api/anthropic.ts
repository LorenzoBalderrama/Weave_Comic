import * as weave from 'weave';
import os from 'os';
import { Anthropic } from 'anthropic';

weave.init('marvel_comics');

client = Anthropic(
    api_key = os.environ.get(process.env.ANTHROPIC_API_KEY),
)

