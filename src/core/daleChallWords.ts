/**
 * Comprehensive Dale-Chall ~3,000 familiar word vocabulary list and inflection matcher.
 * Words known by at least 80% of fourth-grade students.
 */

const RAW_DALE_CHALL_WORDS: string[] = [
  'a', 'able', 'aboard', 'about', 'above', 'absent', 'accept', 'accident', 'account', 'ache',
  'aching', 'acorn', 'acre', 'across', 'act', 'acts', 'action', 'actions', 'active', 'actor',
  'actress', 'actual', 'actually', 'add', 'addition', 'address', 'admire', 'adventure', 'afraid', 'after',
  'afternoon', 'afterward', 'afterwards', 'again', 'against', 'age', 'aged', 'ago', 'agree', 'agreed',
  'agreeing', 'agreement', 'ahead', 'aid', 'aim', 'air', 'airfield', 'airplane', 'airport', 'airship',
  'airy', 'alarm', 'alike', 'alive', 'all', 'alley', 'alligator', 'allow', 'almost', 'alone',
  'along', 'aloud', 'already', 'also', 'always', 'am', 'america', 'american', 'among', 'amount',
  'an', 'and', 'angel', 'anger', 'angry', 'animal', 'animals', 'another', 'answer', 'answers',
  'ant', 'ants', 'any', 'anybody', 'anyhow', 'anyone', 'anything', 'anyway', 'anywhere', 'apart',
  'apartment', 'ape', 'piece', 'apple', 'apples', 'apron', 'are', 'aren\'t', 'arm', 'arms',
  'army', 'around', 'arrange', 'arrangement', 'arrive', 'arrived', 'arrow', 'art', 'artist', 'as',
  'ash', 'ashes', 'aside', 'ask', 'asked', 'asking', 'asleep', 'at', 'ate', 'attack',
  'attend', 'attention', 'aunt', 'author', 'auto', 'automobile', 'autumn', 'avenue', 'awake', 'awaken',
  'away', 'awful', 'awfully', 'axe', 'baby', 'babies', 'back', 'background', 'backward', 'backwards',
  'bacon', 'bad', 'badly', 'bag', 'bags', 'bake', 'baker', 'bakery', 'baking', 'ball',
  'balloon', 'banana', 'bananas', 'band', 'bandage', 'bang', 'bank', 'banker', 'bar', 'barber',
  'bare', 'barefoot', 'barely', 'bark', 'barn', 'barrel', 'base', 'baseball', 'basement', 'basket',
  'basketball', 'bat', 'bath', 'bathe', 'bathing', 'bathroom', 'bathtub', 'battle', 'battleship', 'bay',
  'be', 'beach', 'bead', 'beads', 'beam', 'bean', 'beans', 'bear', 'bears', 'beard',
  'beast', 'beat', 'beating', 'beautiful', 'beautify', 'beauty', 'became', 'because', 'become', 'becomes',
  'becoming', 'bed', 'bedbug', 'bedroom', 'bedspread', 'bedtime', 'bee', 'beef', 'beefsteak', 'beehive',
  'been', 'beer', 'beet', 'beets', 'before', 'beforehand', 'beg', 'began', 'beggar', 'begged',
  'begin', 'beginner', 'beginning', 'begun', 'behave', 'behind', 'being', 'believe', 'believed', 'bell',
  'bells', 'belong', 'belonged', 'below', 'belt', 'bench', 'bend', 'beneath', 'bent', 'berries',
  'berry', 'beside', 'besides', 'best', 'bet', 'better', 'between', 'beyond', 'bicycle', 'big',
  'bigger', 'biggest', 'bill', 'billboard', 'bin', 'bind', 'bird', 'birds', 'birth', 'birthday',
  'biscuit', 'bit', 'bite', 'biting', 'bitter', 'black', 'blackberry', 'blackbird', 'blackboard', 'blackness',
  'blacksmith', 'blame', 'blank', 'blanket', 'blast', 'blaze', 'bleed', 'bleeding', 'blend', 'bless',
  'blessing', 'blew', 'blind', 'blindfold', 'blindness', 'block', 'blood', 'bloom', 'blossom', 'blot',
  'blow', 'blowing', 'blown', 'blowout', 'blue', 'blueberry', 'bluebird', 'bluegrass', 'blush', 'board',
  'boards', 'boat', 'boats', 'bob', 'bobwhite', 'body', 'bodies', 'boil', 'boiler', 'bold',
  'bone', 'bones', 'bonnet', 'boo', 'book', 'books', 'bookcase', 'bookkeeper', 'boom', 'boot',
  'boots', 'born', 'borrow', 'borrowed', 'boss', 'both', 'bother', 'bottle', 'bottom', 'bought',
  'bounce', 'bow', 'bowl', 'bowling', 'box', 'boxes', 'boxcar', 'boy', 'boys', 'brain',
  'brake', 'branch', 'branches', 'brass', 'brave', 'bravery', 'bread', 'break', 'breakfast', 'breast',
  'breath', 'breathe', 'breeze', 'brick', 'bridge', 'bright', 'brightness', 'bring', 'bringing', 'broad',
  'broadcast', 'broke', 'broken', 'brook', 'broom', 'brother', 'brothers', 'brought', 'brown', 'brush',
  'bubble', 'bubbles', 'bucket', 'buckle', 'bud', 'buffalo', 'bug', 'buggy', 'build', 'builder',
  'building', 'buildings', 'built', 'bulb', 'bull', 'bullet', 'bump', 'bun', 'bunch', 'bundle',
  'bunny', 'burn', 'burned', 'burning', 'burst', 'bury', 'bus', 'buses', 'bush', 'bushes',
  'bushel', 'business', 'busy', 'but', 'butcher', 'butt', 'butter', 'butterfly', 'buttermilk', 'buttercup',
  'button', 'buy', 'buyer', 'buying', 'buzz', 'by', 'bye', 'cab', 'cabbage', 'cabin',
  'cabinet', 'cable', 'cage', 'cake', 'cakes', 'calendar', 'calf', 'call', 'called', 'caller',
  'calling', 'came', 'camel', 'camera', 'camp', 'camper', 'campfire', 'can', 'can\'t', 'canal',
  'canary', 'candle', 'candy', 'cane', 'cannon', 'cannot', 'canoe', 'cap', 'cape', 'capital',
  'captain', 'car', 'cars', 'card', 'cardboard', 'care', 'cared', 'career', 'careful', 'carefully',
  'careless', 'carelessness', 'carfare', 'cargo', 'carpenter', 'carpet', 'carriage', 'carry', 'carrying', 'cart',
  'carve', 'case', 'cash', 'cashier', 'cast', 'castle', 'cat', 'cats', 'catch', 'catcher',
  'catching', 'caterpillar', 'cattle', 'caught', 'cause', 'caused', 'causing', 'cave', 'ceiling', 'celebrate',
  'celebration', 'cell', 'cellar', 'cent', 'cents', 'center', 'cereal', 'certain', 'certainly', 'chain',
  'chair', 'chalk', 'champion', 'chance', 'change', 'changed', 'changing', 'chap', 'charge', 'charm',
  'chart', 'chase', 'chatter', 'cheap', 'cheat', 'check', 'checkers', 'cheek', 'cheer', 'cheerful',
  'cheese', 'cherry', 'chest', 'chew', 'chick', 'chicken', 'chickens', 'chief', 'child', 'children',
  'chill', 'chilly', 'chimney', 'chin', 'china', 'chip', 'chocolate', 'choice', 'choose', 'chose',
  'chosen', 'christ', 'christmas', 'church', 'churches', 'churn', 'cigarette', 'circle', 'circus', 'citizen',
  'city', 'cities', 'clap', 'class', 'classes', 'classmate', 'classroom', 'claw', 'clay', 'clean',
  'cleaner', 'cleaning', 'cleanliness', 'clear', 'clearly', 'clever', 'cliff', 'climb', 'climbed', 'climbing',
  'clock', 'clocks', 'close', 'closed', 'closely', 'closer', 'closest', 'closet', 'cloth', 'clothes',
  'clothing', 'cloud', 'clouds', 'cloudy', 'clover', 'clown', 'club', 'cluck', 'clump', 'coach',
  'coal', 'coast', 'coat', 'coats', 'cob', 'cobbler', 'cocoa', 'coconut', 'coffee', 'coin',
  'cold', 'collar', 'college', 'color', 'colored', 'colorful', 'coloring', 'colt', 'column', 'comb',
  'come', 'comes', 'coming', 'comfort', 'comfortable', 'comic', 'common', 'company', 'compare', 'complete',
  'completely', 'computer', 'conductor', 'cone', 'connect', 'connection', 'conquer', 'consent', 'contain', 'content',
  'continue', 'continued', 'cook', 'cooked', 'cooker', 'cookie', 'cookies', 'cooking', 'cool', 'cooler',
  'copper', 'copy', 'cord', 'cork', 'corn', 'corner', 'correct', 'cost', 'cot', 'cottage',
  'cotton', 'couch', 'cough', 'could', 'couldn\'t', 'count', 'counted', 'counter', 'counting', 'country',
  'countries', 'county', 'course', 'court', 'cousin', 'cover', 'covered', 'covering', 'cow', 'cows',
  'coward', 'cowboy', 'crab', 'crack', 'cracker', 'cradle', 'cram', 'crawl', 'crawled', 'crazy',
  'cream', 'creamy', 'creek', 'creep', 'crept', 'cried', 'cries', 'croak', 'crook', 'crooked',
  'crop', 'cross', 'crossed', 'crossing', 'crossroad', 'crossroads', 'crow', 'crowd', 'crowded', 'crown',
  'cruel', 'crumb', 'crush', 'crust', 'cry', 'crying', 'cub', 'cuff', 'cup', 'cups',
  'cupboard', 'cupful', 'cure', 'curl', 'curly', 'curtain', 'curve', 'curved', 'cushion', 'custard',
  'custom', 'customer', 'cut', 'cute', 'cuts', 'cutting', 'dab', 'dad', 'daddy', 'daily',
  'dairy', 'daisy', 'dam', 'damage', 'dame', 'damp', 'dance', 'dancer', 'dancing', 'dandy',
  'danger', 'dangerous', 'dare', 'dark', 'darkness', 'darling', 'dart', 'dash', 'date', 'daughter',
  'dawn', 'day', 'days', 'daybreak', 'daylight', 'daytime', 'dead', 'deaf', 'deal', 'dealer',
  'dear', 'death', 'december', 'decide', 'decided', 'deck', 'deed', 'deep', 'deer', 'defeat',
  'defend', 'defense', 'delight', 'delightful', 'deliver', 'delivery', 'demand', 'den', 'dentist', 'depend',
  'deposit', 'depth', 'describe', 'desert', 'deserve', 'design', 'desire', 'desk', 'destroy', 'devil',
  'dew', 'diamond', 'did', 'didn\'t', 'die', 'died', 'difference', 'different', 'difficult', 'difficulty',
  'dig', 'digging', 'dim', 'dime', 'dine', 'dinner', 'dip', 'direct', 'direction', 'dirt',
  'dirty', 'discover', 'discoverer', 'discovery', 'discuss', 'discussion', 'disease', 'dish', 'dishes', 'disk',
  'dislike', 'dismiss', 'distance', 'distant', 'ditch', 'dive', 'diver', 'divide', 'division', 'do',
  'dock', 'doctor', 'does', 'doesn\'t', 'dog', 'dogs', 'doll', 'dollar', 'dollars', 'dolly',
  'done', 'donkey', 'don\'t', 'door', 'doors', 'doorbell', 'doorknob', 'doorstep', 'dope', 'dot',
  'double', 'dough', 'dove', 'down', 'downstairs', 'downtown', 'downward', 'dozen', 'drag', 'drain',
  'drank', 'draw', 'drawer', 'drawing', 'dream', 'dreamed', 'dreamer', 'dress', 'dresser', 'dresses',
  'dressing', 'drew', 'dried', 'drift', 'drill', 'drink', 'drinking', 'drip', 'drive', 'driven',
  'driver', 'driveway', 'driving', 'drop', 'dropped', 'dropping', 'drops', 'drove', 'drown', 'drowsy',
  'drum', 'drunk', 'dry', 'duck', 'due', 'dug', 'dull', 'dumb', 'dump', 'during',
  'dust', 'dusty', 'duty', 'dwarf', 'dwell', 'dye', 'each', 'eager', 'eagle', 'ear',
  'ears', 'early', 'earn', 'earth', 'east', 'eastern', 'easy', 'easily', 'eat', 'eaten',
  'eater', 'eating', 'edge', 'egg', 'eggs', 'eh', 'eight', 'eighteen', 'eighth', 'eighty',
  'either', 'elbow', 'elder', 'eldest', 'electric', 'electricity', 'elephant', 'eleven', 'elf', 'elm',
  'else', 'elsewhere', 'empty', 'end', 'ended', 'ending', 'enemy', 'engine', 'engineer', 'english',
  'enjoy', 'enjoyment', 'enough', 'enter', 'entire', 'entirely', 'envelope', 'equal', 'erase', 'eraser',
  'errand', 'escape', 'eve', 'even', 'evening', 'ever', 'every', 'everybody', 'everyday', 'everyone',
  'everything', 'everywhere', 'evil', 'exact', 'exactly', 'examination', 'examine', 'example', 'excellent', 'except',
  'exchange', 'excited', 'excitement', 'exciting', 'excuse', 'expect', 'expensive', 'explain', 'explanation', 'express',
  'expression', 'eye', 'eyes', 'eyeball', 'eyebrow', 'eyeglasses', 'eyelash', 'eyelid', 'face', 'fact',
  'factory', 'fade', 'fail', 'failure', 'faint', 'fair', 'fairy', 'faith', 'fake', 'fall',
  'fallen', 'falling', 'falls', 'false', 'family', 'famous', 'fan', 'fancy', 'far', 'fare',
  'farm', 'farmer', 'farming', 'farmland', 'farther', 'fast', 'fasten', 'faster', 'fat', 'father',
  'fault', 'favor', 'favorite', 'fear', 'feast', 'feather', 'feathers', 'february', 'fed', 'feed',
  'feel', 'feeling', 'feet', 'fell', 'fellow', 'felt', 'fence', 'fever', 'few', 'fewer',
  'fib', 'field', 'fierce', 'fiery', 'fifteen', 'fifth', 'fifty', 'fig', 'fight', 'fighter',
  'fighting', 'figure', 'file', 'fill', 'filled', 'film', 'finally', 'find', 'fine', 'finger',
  'fingers', 'finish', 'finished', 'fire', 'firearm', 'firecracker', 'fireplace', 'first', 'fish', 'fisherman',
  'fist', 'fit', 'five', 'fix', 'flag', 'flame', 'flash', 'flat', 'flavor', 'flea',
  'fled', 'flesh', 'flew', 'flight', 'flock', 'flood', 'floor', 'flour', 'flow', 'flower',
  'flowers', 'flutter', 'fly', 'flying', 'foam', 'fog', 'foggy', 'fold', 'folk', 'follow',
  'following', 'fond', 'food', 'fool', 'foolish', 'foot', 'football', 'footstep', 'for', 'forbid',
  'force', 'forest', 'forget', 'forgive', 'fork', 'form', 'fort', 'forth', 'fortune', 'forty',
  'forward', 'fought', 'found', 'fountain', 'four', 'fourteen', 'fourth', 'fox', 'frame', 'free',
  'freedom', 'freeze', 'freight', 'french', 'fresh', 'fret', 'friday', 'fried', 'friend', 'friendly',
  'friendship', 'frighten', 'frog', 'from', 'front', 'frost', 'frown', 'frozen', 'fruit', 'fry',
  'fudge', 'fuel', 'full', 'fun', 'funny', 'fur', 'furniture', 'further', 'future', 'gain',
  'gallon', 'game', 'gang', 'garage', 'garbage', 'garden', 'gardener', 'gas', 'gasoline', 'gate',
  'gather', 'gave', 'gay', 'gear', 'geese', 'general', 'generally', 'gentle', 'gentleman', 'get',
  'getting', 'ghost', 'giant', 'gift', 'gingerbread', 'girl', 'girls', 'give', 'given', 'giving',
  'glad', 'glance', 'glass', 'glasses', 'gleam', 'glide', 'glory', 'glove', 'gloves', 'glow',
  'glue', 'go', 'goal', 'goat', 'gobble', 'god', 'goes', 'going', 'gold', 'golden',
  'goldfish', 'golf', 'gone', 'good', 'goodbye', 'goods', 'goose', 'got', 'govern', 'government',
  'gown', 'grab', 'grace', 'grade', 'grain', 'grand', 'grandchild', 'grandfather', 'grandmother', 'grandpa',
  'grandma', 'grape', 'grapes', 'grapefruit', 'grass', 'grasshopper', 'grateful', 'grave', 'gray', 'grease',
  'great', 'green', 'greet', 'grew', 'grind', 'groan', 'grocery', 'ground', 'group', 'grove',
  'grow', 'growing', 'grown', 'growth', 'grub', 'grunt', 'guard', 'guess', 'guest', 'guide',
  'gulf', 'gum', 'gun', 'gunpowder', 'guy', 'habit', 'had', 'hadn\'t', 'hail', 'hair',
  'haircut', 'half', 'hall', 'ham', 'hammer', 'hand', 'handful', 'handkerchief', 'handle', 'handwriting',
  'hang', 'happen', 'happened', 'happy', 'happily', 'happiness', 'harbor', 'hard', 'hardly', 'hardship',
  'harm', 'harmful', 'harvest', 'has', 'hasn\'t', 'haste', 'hasten', 'hasty', 'hat', 'hate',
  'hateful', 'haul', 'have', 'haven\'t', 'having', 'hawk', 'hay', 'he', 'head', 'headache',
  'headdress', 'headline', 'headquarters', 'heal', 'health', 'healthy', 'heap', 'hear', 'heard', 'hearing',
  'heart', 'heat', 'heater', 'heaven', 'heavy', 'he\'d', 'hedge', 'heel', 'height', 'held',
  'hell', 'hello', 'helmet', 'help', 'helper', 'helpful', 'helping', 'helpless', 'hem', 'hen',
  'her', 'herd', 'here', 'hero', 'hers', 'herself', 'he\'s', 'hid', 'hidden', 'hide',
  'high', 'highway', 'hill', 'hillside', 'hilly', 'him', 'himself', 'hind', 'hint', 'hip',
  'hire', 'his', 'hiss', 'history', 'hit', 'hitch', 'hive', 'ho', 'hoe', 'hog',
  'hold', 'holder', 'holding', 'hole', 'holiday', 'hollow', 'holy', 'home', 'homely', 'homemaker',
  'homesick', 'homestead', 'honest', 'honey', 'honeybee', 'honeymoon', 'honk', 'honor', 'hood', 'hoof',
  'hook', 'hoop', 'hop', 'hope', 'hopeful', 'hopeless', 'horn', 'horse', 'horseback', 'horseshoe',
  'hose', 'hospital', 'host', 'hot', 'hotel', 'hound', 'hour', 'house', 'household', 'housekeeper',
  'housewife', 'housework', 'how', 'however', 'howl', 'hug', 'huge', 'hum', 'human', 'humble',
  'hundred', 'hung', 'hunger', 'hungry', 'hunk', 'hunt', 'hunter', 'hunting', 'hurrah', 'hurry',
  'hurt', 'husband', 'hush', 'hut', 'hymn', 'i', 'ice', 'iceberg', 'icicle', 'icy',
  'i\'d', 'idea', 'ideal', 'idle', 'if', 'ill', 'i\'ll', 'image', 'important', 'importance',
  'impossible', 'improve', 'improvement', 'in', 'inch', 'inches', 'income', 'indeed', 'india', 'indian',
  'indicate', 'indoor', 'indoors', 'industry', 'ink', 'inn', 'inner', 'insect', 'inside', 'instant',
  'instead', 'insult', 'intend', 'interest', 'interested', 'interesting', 'international', 'into', 'introduce', 'invent',
  'invention', 'invitation', 'invite', 'iron', 'is', 'island', 'isn\'t', 'issue', 'it', 'item',
  'its', 'itself', 'i\'ve', 'ivy', 'jack', 'jacket', 'jail', 'jam', 'january', 'jar',
  'jaw', 'jay', 'jelly', 'jellyfish', 'jerk', 'jewel', 'jewelry', 'jingle', 'job', 'join',
  'joint', 'joke', 'jolly', 'journey', 'joy', 'joyful', 'judge', 'judgment', 'jug', 'juice',
  'juicy', 'july', 'jump', 'jumped', 'jumper', 'june', 'jungle', 'junior', 'junk', 'just',
  'keen', 'keep', 'keeper', 'keeping', 'kept', 'kettle', 'key', 'kick', 'kid', 'kill',
  'killer', 'kind', 'kindle', 'kindly', 'kindness', 'king', 'kingdom', 'kiss', 'kitchen', 'kite',
  'kitten', 'kitty', 'knee', 'kneel', 'knelt', 'knife', 'knight', 'knit', 'knob', 'knock',
  'knot', 'know', 'knowing', 'knowledge', 'known', 'lace', 'lack', 'lad', 'ladder', 'ladies',
  'lady', 'laid', 'lake', 'lamb', 'lame', 'lamp', 'land', 'landing', 'landlord', 'lane',
  'language', 'lantern', 'lap', 'lard', 'large', 'largely', 'lark', 'last', 'late', 'lately',
  'later', 'latest', 'latter', 'laugh', 'laughter', 'laundry', 'law', 'lawn', 'lawyer', 'lay',
  'layer', 'lazy', 'lead', 'leader', 'leaf', 'leaves', 'leak', 'lean', 'leap', 'learn',
  'learned', 'learning', 'least', 'leather', 'leave', 'leaving', 'led', 'left', 'leg', 'lemon',
  'lemonade', 'lend', 'length', 'less', 'lesson', 'let', 'let\'s', 'letter', 'letters', 'lettuce',
  'level', 'liberty', 'library', 'license', 'lick', 'lid', 'lie', 'life', 'lift', 'light',
  'lighted', 'lighter', 'lighting', 'lightning', 'like', 'likely', 'liking', 'lily', 'limb', 'lime',
  'limp', 'line', 'linen', 'lion', 'lip', 'lipstick', 'liquid', 'list', 'listen', 'listener',
  'lit', 'little', 'live', 'lively', 'liver', 'lives', 'living', 'lizard', 'load', 'loaf',
  'loan', 'lobster', 'local', 'lock', 'locomotive', 'log', 'lone', 'lonely', 'lonesome', 'long',
  'look', 'looked', 'looking', 'loom', 'loop', 'loose', 'lord', 'lose', 'loser', 'losing',
  'loss', 'lost', 'lot', 'lots', 'loud', 'loudly', 'louse', 'love', 'lovely', 'lover',
  'low', 'lower', 'lowest', 'luck', 'lucky', 'lumber', 'lump', 'lunch', 'luncheon', 'lung',
  'machine', 'machinery', 'mad', 'madam', 'made', 'magazine', 'magic', 'maid', 'mail', 'mailbox',
  'mailman', 'main', 'maintain', 'major', 'make', 'maker', 'making', 'male', 'mama', 'man',
  'manage', 'manager', 'management', 'mane', 'manner', 'many', 'map', 'maple', 'marble', 'march',
  'mare', 'mark', 'marked', 'market', 'marriage', 'marry', 'married', 'mask', 'mass', 'mast',
  'master', 'mat', 'match', 'matches', 'mate', 'material', 'matter', 'mattress', 'may', 'maybe',
  'mayor', 'me', 'meadow', 'meal', 'mean', 'meaning', 'meant', 'measure', 'measurement', 'meat',
  'mechanic', 'medal', 'medicine', 'meet', 'meeting', 'melon', 'melt', 'melted', 'member', 'memory',
  'men', 'mend', 'meow', 'merry', 'mess', 'message', 'messenger', 'met', 'metal', 'meter',
  'method', 'mice', 'middle', 'midnight', 'might', 'mighty', 'mile', 'military', 'milk', 'mill',
  'miller', 'million', 'mind', 'mine', 'miner', 'mint', 'minute', 'mirror', 'mischief', 'misery',
  'miss', 'missed', 'mission', 'mist', 'mistake', 'mister', 'mistress', 'mitt', 'mitten', 'mix',
  'mixture', 'moan', 'moat', 'mob', 'modern', 'moment', 'monday', 'money', 'monkey', 'month',
  'months', 'monthly', 'moon', 'moonlight', 'moose', 'mop', 'more', 'morning', 'moss', 'most',
  'mostly', 'moth', 'mother', 'motor', 'mount', 'mountain', 'mountains', 'mouse', 'mouth', 'move',
  'movement', 'movie', 'movies', 'much', 'mud', 'muddy', 'mug', 'mule', 'multiply', 'murder',
  'music', 'musician', 'must', 'mustard', 'mutton', 'my', 'myself', 'nail', 'naked', 'name',
  'named', 'nap', 'napkin', 'narrow', 'nation', 'national', 'native', 'natural', 'naturally', 'nature',
  'naughty', 'navy', 'near', 'nearby', 'nearly', 'neat', 'neatly', 'necessarily', 'necessary', 'neck',
  'necklace', 'necktie', 'need', 'needed', 'needle', 'needn\'t', 'negro', 'neighbor', 'neighborhood', 'neither',
  'nephew', 'nerve', 'nest', 'net', 'never', 'nevertheless', 'new', 'news', 'newspaper', 'next',
  'nice', 'nicely', 'nickel', 'niece', 'night', 'nightgown', 'nine', 'nineteen', 'ninety', 'no',
  'nobody', 'nod', 'noise', 'noisy', 'none', 'noon', 'noose', 'nor', 'north', 'northern',
  'nose', 'not', 'note', 'notebook', 'nothing', 'notice', 'noticed', 'noun', 'novel', 'november',
  'now', 'nowhere', 'number', 'numbers', 'nurse', 'nut', 'oak', 'oar', 'oats', 'obey',
  'object', 'obtain', 'ocean', 'o\'clock', 'october', 'odd', 'of', 'off', 'offer', 'offered',
  'office', 'officer', 'official', 'often', 'oh', 'oil', 'oilcloth', 'old', 'older', 'oldest',
  'olive', 'on', 'once', 'one', 'ones', 'onion', 'only', 'onto', 'open', 'opened',
  'opening', 'opera', 'operate', 'operation', 'opinion', 'opportunity', 'opposite', 'or', 'orange', 'oranges',
  'orchestra', 'order', 'ordinary', 'organ', 'original', 'ornament', 'orphan', 'other', 'others', 'otherwise',
  'ought', 'ounce', 'our', 'ours', 'ourselves', 'out', 'outdoors', 'outer', 'outline', 'outside',
  'oven', 'over', 'overalls', 'overcoat', 'overcome', 'overhead', 'overhear', 'overnight', 'overturn', 'owe',
  'owl', 'own', 'owner', 'ox', 'oxen', 'pace', 'pack', 'package', 'packet', 'pad',
  'page', 'paid', 'pail', 'pain', 'painful', 'paint', 'painter', 'painting', 'pair', 'palace',
  'pale', 'palm', 'pan', 'pancake', 'pane', 'pansy', 'pants', 'papa', 'paper', 'papers',
  'parade', 'pardon', 'parent', 'parents', 'park', 'part', 'partly', 'partner', 'party', 'parties',
  'pass', 'passed', 'passenger', 'past', 'paste', 'pasture', 'pat', 'patch', 'path', 'patter',
  'pattern', 'pause', 'paw', 'pay', 'payment', 'pea', 'peace', 'peaceful', 'peach', 'peaches',
  'peacock', 'peak', 'peanut', 'pear', 'pearl', 'peas', 'peck', 'peculiar', 'peep', 'peg',
  'pen', 'pencil', 'pennant', 'penny', 'pennies', 'people', 'pepper', 'peppermint', 'per', 'perfect',
  'perform', 'performance', 'perhaps', 'period', 'permission', 'permit', 'person', 'personal', 'pet', 'petal',
  'petticoat', 'phonograph', 'photo', 'photograph', 'piano', 'pick', 'picked', 'picnic', 'picture', 'pictures',
  'pie', 'piece', 'pieces', 'pier', 'pig', 'pigeon', 'piggy', 'pile', 'pill', 'pillow',
  'pin', 'pinch', 'pine', 'pink', 'pint', 'pipe', 'pistol', 'pitch', 'pitcher', 'pity',
  'place', 'placed', 'plain', 'plan', 'planned', 'plane', 'planet', 'plant', 'plantation', 'plaster',
  'plate', 'platform', 'platter', 'play', 'player', 'playground', 'playhouse', 'playmate', 'plaything', 'pleasant',
  'please', 'pleased', 'pleasure', 'plenty', 'plow', 'plug', 'plum', 'plump', 'plunge', 'plus',
  'pocket', 'pocketbook', 'poem', 'poet', 'poetry', 'point', 'pointed', 'poison', 'poisonous', 'poke',
  'pole', 'police', 'policeman', 'polite', 'politely', 'political', 'pond', 'pony', 'pool', 'poor',
  'pop', 'popcorn', 'poppy', 'popular', 'population', 'porch', 'pork', 'port', 'position', 'possession',
  'possible', 'post', 'postage', 'postman', 'pot', 'potato', 'potatoes', 'pound', 'pour', 'powder',
  'power', 'powerful', 'practice', 'praise', 'pray', 'prayer', 'preach', 'preacher', 'precious', 'prefer',
  'prepare', 'prepared', 'present', 'presents', 'preserve', 'president', 'press', 'pressure', 'pretty', 'prevent',
  'price', 'prick', 'pride', 'primary', 'prince', 'princess', 'principal', 'print', 'printed', 'prison',
  'prisoner', 'private', 'prize', 'probably', 'problem', 'proceed', 'produce', 'product', 'production', 'professor',
  'program', 'progress', 'promise', 'prompt', 'proper', 'property', 'protect', 'protection', 'proud', 'prove',
  'provide', 'public', 'pudding', 'puddle', 'puff', 'pull', 'pump', 'pumpkin', 'punch', 'pupil',
  'puppy', 'pure', 'purple', 'purpose', 'purse', 'push', 'puss', 'pussy', 'pussycat', 'put',
  'putting', 'puzzle', 'quack', 'quart', 'quarter', 'queen', 'queer', 'question', 'questions', 'quick',
  'quickly', 'quiet', 'quietly', 'quilt', 'quit', 'quite', 'rabbit', 'race', 'rack', 'radio',
  'radish', 'rag', 'rail', 'railroad', 'railway', 'rain', 'rainbow', 'raincoat', 'rainy', 'raise',
  'raised', 'raisin', 'rake', 'ran', 'ranch', 'rank', 'rapid', 'rare', 'rascal', 'rat',
  'rate', 'rather', 'rattle', 'raw', 'ray', 'reach', 'reached', 'reaching', 'read', 'reader',
  'reading', 'ready', 'real', 'really', 'reap', 'rear', 'reason', 'reasonable', 'receipt', 'receive',
  'received', 'recent', 'recently', 'recipe', 'recite', 'recognize', 'recognized', 'record', 'red', 'redbird',
  'redbreast', 'reduce', 'refuse', 'regular', 'rejoice', 'relation', 'relative', 'relief', 'relieve', 'religion',
  'religious', 'remain', 'remember', 'remind', 'remove', 'rent', 'repair', 'repeat', 'replace', 'reply',
  'report', 'represent', 'require', 'rescue', 'respect', 'responsible', 'rest', 'restaurant', 'result', 'return',
  'returned', 'reward', 'ribbon', 'rice', 'rich', 'rid', 'riddle', 'ride', 'rider', 'riding',
  'rifle', 'right', 'rim', 'ring', 'rip', 'ripe', 'ripen', 'rise', 'rising', 'risk',
  'river', 'road', 'roadside', 'roar', 'roast', 'rob', 'robber', 'robe', 'robin', 'robot',
  'rock', 'rocket', 'rocky', 'rod', 'rode', 'roll', 'roller', 'roof', 'room', 'rooms',
  'rooster', 'root', 'rope', 'rose', 'rot', 'rotten', 'rough', 'round', 'route', 'row',
  'rowboat', 'royal', 'rub', 'rubber', 'rubbish', 'rude', 'rug', 'ruin', 'rule', 'ruler',
  'rumble', 'run', 'rung', 'runner', 'running', 'rush', 'rust', 'rusty', 'rye', 'sack',
  'sad', 'saddle', 'safe', 'safety', 'said', 'sail', 'sailboat', 'sailor', 'saint', 'salad',
  'sale', 'salt', 'same', 'sand', 'sandwich', 'sandy', 'sang', 'sank', 'sap', 'sash',
  'sat', 'satin', 'satisfactory', 'satisfy', 'saturday', 'sauce', 'saucer', 'sausage', 'savage', 'save',
  'saved', 'saving', 'saw', 'sawdust', 'say', 'saying', 'says', 'scale', 'scalp', 'scar',
  'scarce', 'scare', 'scared', 'scarf', 'scatter', 'scene', 'scenery', 'school', 'schoolboy', 'schoolhouse',
  'schoolmaster', 'schoolroom', 'science', 'scientist', 'scissors', 'scold', 'scoop', 'scooter', 'score', 'scorn',
  'scout', 'scrap', 'scrape', 'scratch', 'scream', 'screen', 'screw', 'scrub', 'sea', 'seal',
  'seam', 'search', 'seashore', 'season', 'seat', 'second', 'secret', 'section', 'see', 'seed',
  'seeds', 'seeing', 'seek', 'seem', 'seemed', 'seen', 'seesaw', 'seldom', 'select', 'self',
  'sell', 'seller', 'selling', 'send', 'sending', 'sense', 'sent', 'sentence', 'sentences', 'separate',
  'september', 'serious', 'servant', 'serve', 'service', 'set', 'setting', 'settle', 'settlement', 'seven',
  'seventeen', 'seventh', 'seventy', 'several', 'sew', 'shade', 'shadow', 'shady', 'shake', 'shaker',
  'shaking', 'shall', 'shame', 'shan\'t', 'shape', 'share', 'sharp', 'shave', 'she', 'shed',
  'sheep', 'sheet', 'shelf', 'shell', 'shepherd', 'shine', 'shining', 'shiny', 'ship', 'shirt',
  'shock', 'shoe', 'shoemaker', 'shoes', 'shone', 'shook', 'shoot', 'shop', 'shopper', 'shopping',
  'shore', 'short', 'shot', 'should', 'shoulder', 'shouldn\'t', 'shout', 'shovel', 'show', 'shower',
  'shown', 'shut', 'shy', 'sick', 'sickness', 'side', 'sidewalk', 'sideway', 'sideways', 'sigh',
  'sight', 'sign', 'silence', 'silent', 'silk', 'silly', 'silver', 'simple', 'since', 'sing',
  'singer', 'singing', 'single', 'sink', 'sip', 'sir', 'sis', 'sister', 'sit', 'sitting',
  'six', 'sixteen', 'sixth', 'sixty', 'size', 'skate', 'skater', 'ski', 'skin', 'skip',
  'skirt', 'sky', 'slam', 'slap', 'slate', 'slave', 'sled', 'sleep', 'sleepy', 'sleeve',
  'sleigh', 'slept', 'slice', 'slid', 'slide', 'slight', 'slip', 'slipper', 'slippery', 'slit',
  'slow', 'slowly', 'sly', 'small', 'smart', 'smell', 'smile', 'smiled', 'smoke', 'smooth',
  'snake', 'snap', 'snapping', 'sneeze', 'snow', 'snowball', 'snowflake', 'snowy', 'so', 'soap',
  'sober', 'sock', 'socket', 'socks', 'soda', 'sofa', 'soft', 'softly', 'soil', 'sold',
  'soldier', 'sole', 'solid', 'solve', 'some', 'somebody', 'someday', 'somehow', 'someone', 'something',
  'sometime', 'sometimes', 'somewhere', 'son', 'song', 'soon', 'sore', 'sorrow', 'sorry', 'sort',
  'soul', 'sound', 'soup', 'sour', 'south', 'southern', 'space', 'spade', 'spank', 'spare',
  'spark', 'sparkle', 'sparrow', 'speak', 'speaker', 'speaking', 'spear', 'special', 'speck', 'speech',
  'speed', 'spell', 'spelling', 'spend', 'spent', 'spider', 'spike', 'spill', 'spin', 'spinach',
  'spirit', 'spit', 'spite', 'splash', 'spoil', 'spoke', 'spoken', 'sponge', 'spoon', 'sport',
  'spot', 'spread', 'spring', 'springtime', 'sprinkle', 'spur', 'spy', 'square', 'squash', 'squeak',
  'squeal', 'squeeze', 'squirrel', 'stable', 'stack', 'stage', 'stair', 'stairs', 'stall', 'stamp',
  'stand', 'star', 'stare', 'starfish', 'start', 'started', 'starting', 'starve', 'state', 'states',
  'station', 'statue', 'stay', 'stayed', 'stead', 'steady', 'steak', 'steal', 'steam', 'steamboat',
  'steamer', 'steel', 'steep', 'steeple', 'steer', 'stem', 'step', 'stepped', 'stepping', 'steps',
  'stick', 'sticky', 'stiff', 'still', 'sting', 'stir', 'stitch', 'stock', 'stocking', 'stole',
  'stolen', 'stone', 'stood', 'stool', 'stoop', 'stop', 'stopped', 'stopping', 'storage', 'store',
  'stored', 'storekeeper', 'stories', 'storm', 'stormy', 'story', 'stove', 'straight', 'strange', 'stranger',
  'strap', 'straw', 'strawberry', 'stream', 'street', 'streets', 'stretch', 'strict', 'strike', 'string',
  'strip', 'stripe', 'strong', 'stuck', 'student', 'students', 'study', 'studied', 'studying', 'stuff',
  'stumble', 'stump', 'style', 'subject', 'submarine', 'substance', 'subtract', 'succeed', 'success', 'successful',
  'such', 'suck', 'sudden', 'suddenly', 'suffer', 'sugar', 'suit', 'suitable', 'suitcase', 'summer',
  'sun', 'sunbeam', 'sunday', 'sunflower', 'sung', 'sunlight', 'sunny', 'sunrise', 'sunset', 'sunshine',
  'supper', 'supply', 'suppose', 'sure', 'surely', 'surface', 'surprise', 'surprised', 'surround', 'swallow',
  'swam', 'swamp', 'swan', 'swat', 'swear', 'sweat', 'sweater', 'sweep', 'sweet', 'sweetheart',
  'sweetness', 'swell', 'swept', 'swift', 'swim', 'swimming', 'swing', 'switch', 'sword', 'swore',
  'table', 'tablecloth', 'tablespoon', 'tablet', 'tack', 'tag', 'tail', 'tailor', 'take', 'taken',
  'taking', 'tale', 'talk', 'talked', 'talking', 'tall', 'tame', 'tank', 'tap', 'tape',
  'tar', 'tardy', 'task', 'taste', 'taught', 'tax', 'tea', 'teach', 'teacher', 'teaching',
  'team', 'tear', 'tease', 'teaspoon', 'teeth', 'telephone', 'tell', 'telling', 'temper', 'temperature',
  'ten', 'tender', 'tennis', 'tent', 'term', 'terrible', 'test', 'than', 'thank', 'thankful',
  'thanks', 'thanksgiving', 'that', 'that\'s', 'the', 'theater', 'thee', 'their', 'theirs', 'them',
  'themselves', 'then', 'there', 'therefore', 'these', 'they', 'they\'d', 'they\'ll', 'they\'re', 'they\'ve',
  'thick', 'thief', 'thimble', 'thin', 'thing', 'things', 'think', 'thinking', 'third', 'thirsty',
  'thirteen', 'thirty', 'this', 'thorn', 'those', 'though', 'thought', 'thousand', 'thread', 'threat',
  'three', 'threw', 'throat', 'throne', 'through', 'throw', 'thrown', 'thumb', 'thunder', 'thursday',
  'thus', 'tick', 'ticket', 'tide', 'tidy', 'tie', 'tied', 'tiger', 'tight', 'till',
  'time', 'times', 'tin', 'tinkle', 'tiny', 'tip', 'tiptoe', 'tire', 'tired', 'tissue',
  'title', 'to', 'toad', 'toadstool', 'toast', 'tobacco', 'today', 'toe', 'toes', 'together',
  'toilet', 'told', 'tomato', 'tomatoes', 'tomorrow', 'ton', 'tone', 'tongue', 'tonight', 'too',
  'took', 'tool', 'tools', 'tooth', 'toothbrush', 'toothpick', 'top', 'tore', 'torn', 'toss',
  'total', 'touch', 'touched', 'tow', 'toward', 'towards', 'towel', 'tower', 'town', 'toy',
  'trace', 'track', 'trade', 'traffic', 'trail', 'train', 'trap', 'travel', 'traveler', 'tray',
  'treasure', 'treat', 'tree', 'trees', 'trick', 'trip', 'troop', 'trouble', 'truck', 'true',
  'truly', 'trunk', 'trust', 'truth', 'try', 'trying', 'tub', 'tube', 'tuesday', 'tug',
  'tulip', 'tumble', 'tune', 'tunnel', 'turkey', 'turn', 'turned', 'turning', 'turtle', 'twelve',
  'twenty', 'twice', 'twig', 'twin', 'two', 'type', 'ugly', 'umbrella', 'uncle', 'under',
  'understand', 'understood', 'underwear', 'undress', 'unfair', 'unfold', 'unfriendly', 'unhappy', 'uniform', 'union',
  'unit', 'unite', 'united', 'universe', 'university', 'unknown', 'unless', 'unpleasant', 'until', 'unusual',
  'up', 'upon', 'upper', 'upset', 'upside', 'upstairs', 'uptown', 'upward', 'us', 'use',
  'used', 'useful', 'useless', 'using', 'usual', 'usually', 'valley', 'valuable', 'value', 'van',
  'vanish', 'vapor', 'vase', 'vast', 'vegetable', 'vegetables', 'veil', 'velvet', 'verb', 'verse',
  'very', 'vessel', 'vest', 'victim', 'victory', 'view', 'village', 'villager', 'vine', 'violet',
  'violin', 'visit', 'visitor', 'voice', 'volcano', 'volume', 'vote', 'vow', 'voyage', 'wade',
  'wagon', 'waist', 'wait', 'waiter', 'wake', 'waken', 'walk', 'walked', 'walking', 'wall',
  'walnut', 'wander', 'want', 'wanted', 'war', 'warm', 'warmth', 'warn', 'warning', 'was',
  'wash', 'washer', 'washcloth', 'washing', 'wasn\'t', 'waste', 'watch', 'watched', 'watchman', 'water',
  'watermelon', 'waterproof', 'wave', 'wax', 'way', 'ways', 'we', 'weak', 'wealth', 'weapon',
  'wear', 'weary', 'weather', 'weave', 'web', 'we\'d', 'wedding', 'wednesday', 'wee', 'weed',
  'week', 'weeks', 'weekday', 'weekend', 'weigh', 'weight', 'welcome', 'well', 'we\'ll', 'went',
  'were', 'we\'re', 'weren\'t', 'west', 'western', 'wet', 'we\'ve', 'whale', 'what', 'whatever',
  'what\'s', 'wheat', 'wheel', 'when', 'whenever', 'where', 'wherever', 'whether', 'which', 'while',
  'whip', 'whirl', 'whisky', 'whisper', 'whistle', 'white', 'who', 'whoever', 'whole', 'whose',
  'why', 'wicked', 'wide', 'widely', 'width', 'wife', 'wild', 'wilderness', 'will', 'willing',
  'win', 'wind', 'window', 'windows', 'windy', 'wine', 'wing', 'wink', 'winner', 'winter',
  'wipe', 'wire', 'wisdom', 'wise', 'wish', 'wished', 'wit', 'with', 'within', 'without',
  'woe', 'wolf', 'wolves', 'woman', 'women', 'won', 'wonder', 'wonderful', 'won\'t', 'wood',
  'wooden', 'woodpecker', 'woods', 'wool', 'woolen', 'word', 'words', 'wore', 'work', 'worker',
  'working', 'workman', 'world', 'worm', 'worn', 'worry', 'worse', 'worst', 'worth', 'would',
  'wouldn\'t', 'wound', 'wove', 'wrap', 'wreck', 'wrist', 'write', 'writer', 'writing', 'written',
  'wrong', 'wrote', 'wrung', 'yard', 'yarn', 'yawn', 'year', 'years', 'yell', 'yellow',
  'yes', 'yesterday', 'yet', 'yield', 'yolk', 'yonder', 'you', 'you\'d', 'you\'ll', 'young',
  'your', 'you\'re', 'yours', 'yourself', 'yourselves', 'youth', 'you\'ve', 'zebra', 'zero', 'zipper',
  'zone', 'zoo'
];

export const DALE_CHALL_SET: Set<string> = new Set(RAW_DALE_CHALL_WORDS);

/**
 * Checks if a word is in the Dale-Chall familiar vocabulary list,
 * supporting case-insensitivity and standard English regular inflections.
 * 
 * @param rawWord Input word string
 * @returns true if word or its lemma is familiar
 */
export function isDaleChallFamiliar(rawWord: string): boolean {
  if (!rawWord) return false;

  // Direct set hit fast-path
  if (DALE_CHALL_SET.has(rawWord)) return true;

  let word = rawWord.toLowerCase();
  if (/[^a-z']/.test(word)) {
    word = word.replace(/[^a-z']/g, '');
  }
  if (!word) return false;

  // Possessive handling ('s and trailing ')
  if (word.endsWith("'s") && word.length > 2) {
    word = word.slice(0, -2);
  } else if (word.endsWith("'") && word.length > 2) {
    word = word.slice(0, -1);
  }

  // Exact set match
  if (DALE_CHALL_SET.has(word)) {
    return true;
  }

  // Handle plural / third-person singular (-s, -es, -ies)
  if (word.endsWith('s') && word.length > 2) {
    if (DALE_CHALL_SET.has(word.slice(0, -1))) {
      return true;
    }
    if (word.endsWith('es') && word.length > 3) {
      if (DALE_CHALL_SET.has(word.slice(0, -2))) {
        return true;
      }
    }
    if (word.endsWith('ies') && word.length > 4) {
      if (DALE_CHALL_SET.has(word.slice(0, -3) + 'y')) {
        return true;
      }
    }
  }

  // Handle past tense / past participle (-ed, -d, -ied, doubled consonant)
  if (word.endsWith('ed') && word.length > 3) {
    if (DALE_CHALL_SET.has(word.slice(0, -2))) {
      return true;
    }
    if (DALE_CHALL_SET.has(word.slice(0, -1))) {
      return true;
    }
    if (word.endsWith('ied') && word.length > 4) {
      if (DALE_CHALL_SET.has(word.slice(0, -3) + 'y')) {
        return true;
      }
    }
    // Doubled consonant (e.g. stopped -> stop, planned -> plan)
    if (word.length > 5 && word[word.length - 3] === word[word.length - 4]) {
      if (DALE_CHALL_SET.has(word.slice(0, -3))) {
        return true;
      }
    }
  }

  // Handle progressive aspect (-ing, -ying, doubled consonant)
  if (word.endsWith('ing') && word.length > 4) {
    if (DALE_CHALL_SET.has(word.slice(0, -3))) {
      return true;
    }
    // Stem ending in silent 'e' (e.g. making -> make, closing -> close)
    if (DALE_CHALL_SET.has(word.slice(0, -3) + 'e')) {
      return true;
    }
    if (word.endsWith('ying') && word.length >= 5) {
      if (DALE_CHALL_SET.has(word.slice(0, -4) + 'ie')) {
        return true;
      }
    }
    // Doubled consonant (e.g. running -> run, swimming -> swim)
    if (word.length > 6 && word[word.length - 4] === word[word.length - 5]) {
      if (DALE_CHALL_SET.has(word.slice(0, -4))) {
        return true;
      }
    }
  }

  // Handle comparative / superlative (-er, -est, -ier, -iest)
  if (word.endsWith('er') && word.length > 3) {
    if (DALE_CHALL_SET.has(word.slice(0, -2))) {
      return true;
    }
    if (DALE_CHALL_SET.has(word.slice(0, -1))) {
      return true;
    }
    if (word.endsWith('ier') && word.length > 4) {
      if (DALE_CHALL_SET.has(word.slice(0, -3) + 'y')) {
        return true;
      }
    }
    if (word.length > 5 && word[word.length - 3] === word[word.length - 4]) {
      if (DALE_CHALL_SET.has(word.slice(0, -3))) {
        return true;
      }
    }
  }

  if (word.endsWith('est') && word.length > 4) {
    if (DALE_CHALL_SET.has(word.slice(0, -3))) {
      return true;
    }
    if (DALE_CHALL_SET.has(word.slice(0, -2))) {
      return true;
    }
    if (word.endsWith('iest') && word.length > 5) {
      if (DALE_CHALL_SET.has(word.slice(0, -4) + 'y')) {
        return true;
      }
    }
    if (word.length > 6 && word[word.length - 4] === word[word.length - 5]) {
      if (DALE_CHALL_SET.has(word.slice(0, -4))) {
        return true;
      }
    }
  }

  // Handle adverbs (-ly, -ily)
  if (word.endsWith('ly') && word.length > 3) {
    if (DALE_CHALL_SET.has(word.slice(0, -2))) {
      return true;
    }
    if (word.endsWith('ily') && word.length > 4) {
      if (DALE_CHALL_SET.has(word.slice(0, -3) + 'y')) {
        return true;
      }
    }
  }

  return false;
}
