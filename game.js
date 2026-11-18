'use strict';

const data = {
  photo: {
    title: 'The window photo',
    label: '10:45 · forwarded image',
    img: 'window.webp',
    alt: 'One lit window in a dark apartment block',
    body: 'Only one square is lit. There is no visible person, outlet, or light fixture. Jordan received the photo from Eli and did not take it himself.'
  },
  source: {
    title: 'Original message',
    label: '10:44 · Eli → Jordan',
    body: '“if anyone needs a light i can see one across the courtyard.” The original message never names Sam. Jordan added that part.'
  },
  lantern: {
    title: 'Sam’s lantern',
    label: '10:52 · private attachment',
    body: 'Sam sends a close-up of a portable lantern on a windowsill. The battery compartment is open. The matching window frame explains the light, but does not tell you why the building went dark.'
  },
  board: {
    title: 'Floor plan',
    label: 'Resident portal · level 3',
    img: 'board.svg',
    alt: 'Third-floor plan showing the stairs and electrical panel near unit 3D',
    body: 'Unit 3D and the panel are near each other, but they are separate. Sound from the panel recess can seem to come from 3D when heard on the stairs.'
  },
  notice: {
    title: 'Maintenance notice',
    label: '8:14 PM · resident portal',
    body: 'A notice sent before the blackout says the corridor panel has a faulty relay. It warns residents to stay clear of the panel and contact the night desk. It does not confirm what caused tonight’s outage.'
  },
  audio: {
    title: 'Stairwell recording',
    label: '10:55 · Maya’s voice note',
    body: 'Two sharp clicks. Then Maya whispers, “It’s in the hall, not his room.” Her recording places the sound near the electrical panel. The chat’s forwarded version cuts off her whisper.'
  }
};

const scenes = [
  ['The window', '10:45 PM', 'What do you do with the photo?'],
  ['The source', '10:47 PM', 'Whose version do you follow?'],
  ['The typing indicator', '10:51 PM', 'Sam still hasn’t answered the group.'],
  ['The stairwell', '10:55 PM', 'The chat hears two clicks upstairs.'],
  ['At the door', '10:58 PM', 'Jordan is about to knock.'],
  ['The last message', '11:01 PM', 'What will you put in the building chat?']
];

const endings = {
  together: {
    title: 'Leave the light on',
    copy: 'Jordan backs away from the door. A minute later, people are asking who needs a flashlight. The outage is still unexplained, but the chat has stopped looking for someone to blame.'
  },
  official: {
    title: 'Wait on the landing',
    copy: 'The night desk tells everyone to move away from the panel. No one knocks on Sam’s door. People stop posting accusations, but nobody takes theirs back.'
  },
  rumor: {
    title: 'Forwarded again',
    copy: 'Someone crops out your correction and forwards the photo again. The building gets power back before midnight. By morning, people remember Sam’s room number better than they remember what they actually saw.'
  },
  door: {
    title: 'No reply',
    copy: 'Nobody replies.'
  }
};

function msg(s, who, text, channel = 'chat', attachment) {
  s.timeline.push({ who, text, channel, attachment });
}

function add(s, id) {
  if (!s.clues.includes(id)) {
    s.clues.push(id);
  }
}

function start() {
  let s = {
    stage: 0,
    heat: 1,
    trust: 0,
    clues: ['photo'],
    timeline: [],
    history: [],
    ending: null,
    alerted: false
  };

  msg(s, 'Maya', 'did everyone else just lose power');
  msg(s, 'Jordan', 'yeah. the hall lights too');
  msg(s, 'Maya', 'checking the outage page. give me a second');
  msg(s, 'Eli', 'wifi’s gone. the page won’t load on data either');
  msg(s, 'Maya', 'has anyone called the night desk');
  msg(s, 'Jordan', 'twice. it rings then cuts out');
  msg(s, 'Eli', 'texts are getting through. calls keep dropping');
  msg(s, 'Maya', 'okay. stay away from the panels. let me try calling too');
  msg(s, 'Jordan', 'my phone’s on 8 percent. we need an actual answer');
  msg(s, 'Sam', 'anybody have a flashlight');
  msg(s, 'Jordan', 'hold on. look across the courtyard', 'chat', 'photo');
  msg(s, 'Maya', 'is that sam’s window?');
  msg(s, 'Jordan', 'if everyone lost power why is his still on');
  msg(s, 'Maya', 'a light doesn’t tell us what caused it');
  msg(s, 'Jordan', 'then why’s he the only one');

  return s;
}

function options(s) {
  return [
    [
      'Forward the photo to the building chat',
      'Ask when the photo was taken',
      'Ask Sam in the group chat'
    ],
    [
      'Ask Eli for the original message',
      'Look up the building floor plan',
      'Back Jordan’s explanation'
    ],
    [
      'Message Sam privately',
      'Check the resident portal',
      'Wait for Sam in the group chat'
    ],
    [
      'Ask Maya for the full recording',
      'Call the night desk',
      'Go to the landing with Jordan'
    ],
    [
      s.clues.includes('lantern')
        ? 'Show Jordan Sam’s lantern photo'
        : 'Tell Jordan the photo proves nothing',
      'Ask Maya to keep Jordan on the landing',
      'Give Jordan Sam’s room number'
    ],
    [
      'Post what you can verify',
      'Tell everyone to wait for the night desk',
      'Repost the accusation'
    ]
  ][s.stage];
}

function choose(s, n) {
  const opts = options(s);

  if (s.ending || !opts || !Number.isInteger(n) || !opts[n]) {
    return;
  }

  s.history.push(opts[n]);

  const lines = [
    [
      'sending this to everyone. someone has to know what’s going on',
      'wait. when was this taken?',
      'sam, do you still have power? please answer'
    ],
    [
      'eli please send me the original. this is getting out of hand',
      'i saved the floor plan. i’ll check it',
      'yeah that looks like 3D. how else would his light be on'
    ],
    [
      'hey, you okay? people are asking where you live',
      'i’ll check the notices saved on my phone',
      'can we give him a minute. silence doesn’t prove anything'
    ],
    [
      'maya send the whole recording. not just those two clicks',
      'i’m trying the night desk again. don’t go near the panel',
      'i’ll meet you upstairs. we can’t just sit here'
    ],
    [
      s.clues.includes('lantern')
        ? 'it’s a battery lantern. look'
        : 'the photo only shows a light',
      'maya can you get jordan to wait',
      'he’s in 3D'
    ],
    [
      s.clues.includes('lantern')
        ? 'sam has a battery lantern. we don’t know what caused the blackout'
        : s.clues.includes('audio')
          ? 'maya heard it in the hall, not sam’s room'
          : s.clues.includes('source')
            ? 'eli never said it was sam. he just saw a light'
            : s.clues.includes('notice')
              ? 'maintenance flagged the panel before the outage'
              : 'the photo doesn’t show what caused the blackout',
      'leave the panel alone. wait for the night desk',
      'i think jordan was right about sam'
    ]
  ];

  const dm = s.stage >= 1 && s.stage <= 3 && n === 0;

  const attachment =
    s.stage === 0 && n === 0
      ? 'photo'
      : s.stage === 4 && n === 0 && s.clues.includes('lantern')
        ? 'lantern'
        : undefined;

  msg(s, 'You', lines[s.stage][n], dm ? 'dm' : 'chat', attachment);

  switch (s.stage) {
    case 0:
      if (n === 0) {
        s.heat += 2;
        msg(s, 'Eli', 'wait is that definitely 3D?');
        msg(s, 'Jordan', 'yeah. i know that window');
        msg(s, 'Maya', 'you sent it before we even checked');
      }

      if (n === 1) {
        s.trust++;
        msg(s, 'Jordan', 'i didn’t take it. eli sent it');
        msg(s, 'Maya', 'so we know when it was sent, not when it was taken');
      }

      if (n === 2) {
        s.heat++;
        msg(s, 'Sam', '', 'typing');
      }

      break;

    case 1:
      if (n === 0) {
        add(s, 'source');
        s.trust++;
        msg(
          s,
          'Eli',
          'i never said it was him. here’s what i actually sent',
          'dm',
          'source'
        );
        msg(s, 'Maya', 'can someone show me what eli actually said');
      }

      if (n === 1) {
        add(s, 'board');
        msg(
          s,
          'System',
          'You open a floor plan saved with your move-in email.',
          'chat',
          'board'
        );
        msg(s, 'Jordan', 'yeah, 3D. that’s where i’m going');
        msg(s, 'Maya', 'it’s a map, jordan. not proof');
      }

      if (n === 2) {
        s.heat += 2;
        msg(s, 'Jordan', 'thank you. finally someone else sees it');
      }

      break;

    case 2:
      if (n === 0) {
        add(s, 'lantern');
        s.trust++;
        msg(
          s,
          'Sam',
          'yeah. sorry. messages keep failing and i was looking for batteries',
          'dm',
          'lantern'
        );
        msg(s, 'Sam', 'why are people asking where i live', 'dm');
      }

      if (n === 1) {
        add(s, 'notice');
        msg(
          s,
          'System',
          'A maintenance notice from earlier is still saved in your notifications.',
          'chat',
          'notice'
        );
        msg(s, 'Maya', 'that was sent before any of this. please read it');
      }

      if (n === 2) {
        s.heat++;
        msg(s, 'Sam', '', 'typing');
        msg(s, 'Jordan', 'he’s had five minutes. he can see us asking');
        msg(s, 'Maya', 'you don’t know that. my messages are barely sending');
      }

      break;

    case 3:
      if (n === 0) {
        add(s, 'audio');
        s.trust++;
        msg(s, 'Maya', 'listen to the end. somebody cut it off', 'dm', 'audio');
      }

      if (n === 1) {
        s.alerted = true;
        msg(s, 'System', 'Your first call drops. You redial and get through.');
        msg(
          s,
          'Night desk',
          'We’re getting calls from across the building. Keep everyone away from the panel. We’re sending someone.',
          'dm'
        );
        msg(s, 'Maya', 'finally. jordan, someone’s coming. wait for them');
      }

      if (n === 2) {
        add(s, 'board');
        s.heat++;
        msg(s, 'Jordan', 'just point me to the door');
        msg(
          s,
          'Maya',
          'don’t touch the panel. neither of you knows what’s wrong with it'
        );
        msg(
          s,
          'System',
          'You find a floor plan by the landing.',
          'chat',
          'board'
        );
      }

      break;

    case 4:
      if (n === 0 && s.clues.includes('lantern')) {
        s.heat -= 2;
        s.trust += 2;
        msg(s, 'Jordan', 'wait. that actually is the same window');
      } else if (n === 0) {
        s.trust++;
        msg(s, 'Jordan', 'then tell me what it does prove');
      }

      if (n === 1) {
        s.heat--;
        s.trust++;
        msg(s, 'Maya', 'i’m here. jordan, just wait a second');
      }

      if (n === 2) {
        s.heat += 3;
        msg(s, 'Jordan', 'i’m at his door');
      }

      break;

    case 5: {
      const verified = s.clues.some(c =>
        ['lantern', 'source', 'audio', 'notice'].includes(c)
      );

      if (n === 2) {
        s.ending = 'door';
      } else if (
        n === 1 &&
        (s.alerted || s.clues.includes('notice') || s.heat <= 2)
      ) {
        s.ending = 'official';
      } else if (
        n === 0 &&
        verified &&
        s.trust >= 2 &&
        s.heat <= 4
      ) {
        s.ending = 'together';
      } else if (s.heat >= 6) {
        s.ending = 'door';
      } else {
        s.ending = 'rumor';
      }

      if (s.ending === 'door') {
        msg(s, 'Jordan', 'i knocked twice. he won’t open it');
        msg(s, 'Sam', 'jordan i’m behind you');
        msg(s, 'Jordan', 'then who just knocked back', 'chat', 'knock');
        msg(s, 'Sam', '', 'typing');
      } else if (s.ending === 'together') {
        msg(s, 'Jordan', 'sam. i’m sorry. i’m coming back down');
        msg(s, 'Sam', 'wait. take the lantern with you');
        msg(
          s,
          'Maya',
          'leave it in the window. there’s someone crossing the courtyard'
        );
        msg(s, 'Maya', 'they’re using it to find us');
      } else if (s.ending === 'official') {
        msg(
          s,
          'Night desk',
          'Stay on the landing. We’re on our way to the panel.',
          'chat',
          'knock'
        );
        msg(s, 'Jordan', 'wait, are you guys at the end of the hall');
        msg(s, 'Night desk', 'We’re on the first floor. Don’t go any closer.');
      } else {
        msg(s, 'Eli', 'they put sam’s room number on the photo');
        msg(s, 'Sam', 'someone slid a printout of it under my door');
        msg(s, 'Sam', 'it has my name on it');
        msg(s, 'Sam', 'i never told anyone outside this chat where i live');
      }

      break;
    }
  }

  s.heat = Math.max(0, s.heat);
  s.stage++;

  if (s.stage === 1) {
    msg(s, 'Eli', 'i think that’s my picture');
    msg(s, 'Maya', 'i checked from the front entrance. the street’s dark too');
    msg(s, 'Maya', 'no update outside. i’m coming back to the stairs');
  }

  if (s.stage === 2) {
    msg(s, 'Maya', 'still can’t get the desk. i left a message');
    msg(s, 'Jordan', 'sam. answer the chat');
  }

  if (s.stage === 3) {
    msg(s, 'Maya', 'just heard two clicks upstairs', 'chat', 'knock');
    msg(s, 'Jordan', 'he’s messing with the power');
  }

  if (s.stage === 4) {
    msg(s, 'Jordan', 'i’m on three. i can see the light under his door');
  }

  if (s.stage === 5) {
    msg(
      s,
      'Maya',
      'everyone in the building chat is waiting for us to say what happened'
    );
  }
}

if (typeof module !== 'undefined') {
  module.exports = { start, choose, options, endings, data };
}

if (typeof document !== 'undefined') {
  const $ = id => document.getElementById(id);

  const thread = $('thread');
  const messages = $('messages');
  const typing = $('typing');
  const replies = $('replies');

  const notes = {
    source: 'Forwarded from Eli: “if anyone needs a light i can see one across the courtyard.”',
    lantern: '[Photo: a battery lantern on the windowsill.]',
    board: '[Floor plan: the electrical panel is in the hall next to 3D.]',
    notice: '8:14 PM · The third-floor panel has a faulty relay. Keep clear and call the night desk.',
    audio: 'Voice note transcript: [two clicks] “it’s in the hall, not his room.”'
  };

  let state;
  let cursor = 0;
  let run = 0;

  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

  function element(tag, text, cls) {
    const e = document.createElement(tag);

    if (text) {
      e.textContent = text;
    }

    if (cls) {
      e.className = cls;
    }

    return e;
  }

  function control(text, fn) {
    const e = element('button', text);
    e.type = 'button';
    e.onclick = fn;
    return e;
  }

  let audioContext;
  let soundOn = false;

  const sound = control('Sound off', async () => {
    if (soundOn) {
      soundOn = false;
      syncSound();
      return;
    }

    try {
      const Audio = window.AudioContext || window.webkitAudioContext;

      if (!Audio) {
        throw new Error('Audio unavailable');
      }

      audioContext ||= new Audio();
      await audioContext.resume();

      soundOn = true;
      syncSound();
      cue('text');
    } catch {
      sound.textContent = 'Sound unavailable';
      sound.disabled = true;
    }
  });

  function syncSound() {
    sound.textContent = soundOn ? 'Sound on' : 'Sound off';
    sound.setAttribute('aria-pressed', String(soundOn));
  }

  sound.style.cssText =
    'margin-top:6px;border:0;border-radius:12px;padding:4px 9px;background:#eaeaec;color:#42434a;font-size:11px';

  syncSound();
  document.querySelector('.phone header').append(sound);

  function cue(kind) {
    if (!soundOn || audioContext?.state !== 'running') {
      return;
    }

    const t = audioContext.currentTime;

    const tones = kind === 'knock'
      ? [[0, 107, 0.14], [0.27, 89, 0.14]]
      : [[0, 570, 0.085]];

    for (const [delay, hz, length] of tones) {
      const startTime = t + delay;
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();

      osc.type = kind === 'knock' ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(hz, startTime);
      osc.frequency.exponentialRampToValueAtTime(
        hz * 0.75,
        startTime + length
      );

      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.exponentialRampToValueAtTime(
        kind === 'knock' ? 0.13 : 0.055,
        startTime + 0.012
      );
      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        startTime + length
      );

      osc.connect(gain);
      gain.connect(audioContext.destination);

      osc.start(startTime);
      osc.stop(startTime + length);
    }
  }

  function bottom() {
    thread.scrollTop = thread.scrollHeight;
  }

  function name(m) {
    return m.who + (m.channel === 'dm' ? ' · private text' : '');
  }

  function dots(m) {
    const row = element('div', null, 'message');
    const icon = element('div', null, 'dots');

    icon.setAttribute('role', 'status');
    icon.setAttribute('aria-label', m.who + ' is typing');

    for (let j = 0; j < 3; j++) {
      icon.append(element('i'));
    }

    row.append(element('div', name(m), 'name'), icon);
    typing.replaceChildren(row);
    bottom();
  }

  function show(m) {
    if (m.who === 'System') {
      messages.append(element('p', m.text, 'notice'));
      return;
    }

    const out = m.who === 'You';
    const row = element('div', null, 'message' + (out ? ' out' : ''));

    if (!out || m.channel === 'dm') {
      row.append(element('div', name(m), 'name'));
    }

    row.append(element('div', m.text, 'bubble'));

    if (m.attachment === 'photo') {
      const pic = element('img', null, 'photo');
      pic.src = data.photo.img;
      pic.alt = data.photo.alt;
      pic.width = 255;
      pic.height = 170;
      row.append(pic);
    } else if (notes[m.attachment]) {
      row.append(element('div', notes[m.attachment], 'attachment'));
    }

    messages.append(row);
  }

  function ready() {
    if (state.ending) {
      messages.append(element('p', 'End of conversation', 'notice'));
      replies.append(control('Play again', begin));
    } else {
      replies.append(element('small', 'Choose a reply'));

      options(state).forEach((label, i) => {
        replies.append(
          control(label, () => {
            replies.replaceChildren();
            choose(state, i);
            void play(run);
          })
        );
      });
    }

    bottom();
  }

  async function play(id) {
    while (id === run && cursor < state.timeline.length) {
      const m = state.timeline[cursor++];

      if (m.who !== 'You' && m.who !== 'System') {
        dots(m);

        await wait(
          m.channel === 'typing'
            ? 1400
            : Math.min(1500, 510 + m.text.length * 12)
        );

        if (id !== run) {
          return;
        }

        typing.replaceChildren();

        if (m.channel === 'typing') {
          await wait(400);
          continue;
        }
      }

      if (id !== run) {
        return;
      }

      show(m);

      if (m.who !== 'You' && m.who !== 'System') {
        cue(m.attachment === 'knock' ? 'knock' : 'text');
      }

      bottom();
      await wait(m.attachment === 'knock' ? 620 : 220);
    }

    if (id === run) {
      ready();
    }
  }

  function begin() {
    run++;
    cursor = 0;
    state = start();

    messages.replaceChildren();
    typing.replaceChildren();
    replies.replaceChildren();

    thread.focus({ preventScroll: true });
    void play(run);
  }

  $('begin').onclick = begin;
}
