'use strict';

// Demo verileri yalnızca bu sayfada kullanılır; herhangi bir yere gönderilmez.
const questions = {
  yks: {
    subject: 'YKS · Matematik',
    text: 'f(x) = 2x + 3 ise f(2) kaçtır?',
    answers: ['5', '7', '9'], correct: 1,
    explanation: 'x yerine 2 yazılır: 2 × 2 + 3 = 7.'
  },
  lgs: {
    subject: 'LGS · Matematik',
    text: '80 sayısının %25’i kaçtır?',
    answers: ['15', '20', '25'], correct: 1,
    explanation: '%25 dörtte birdir; 80 ÷ 4 = 20.'
  },
  kpss: {
    subject: 'KPSS · Türkçe',
    text: '“Kitaplar” sözcüğündeki “-lar” eki hangi anlamı katar?',
    answers: ['Çoğulluk', 'Olumsuzluk', 'Sahiplik'], correct: 0,
    explanation: '“-lar” eki, birden fazla kitabı belirtir.'
  },
  ales: {
    subject: 'ALES · Sayısal akıl yürütme',
    text: '3, 6, 12, 24, ? dizisinde sıradaki sayı nedir?',
    answers: ['30', '36', '48'], correct: 2,
    explanation: 'Her sayı bir öncekinin iki katıdır; 24 × 2 = 48.'
  },
  yds: {
    subject: 'YDS/YÖKDİL · İngilizce',
    text: 'She ___ to school every day.',
    answers: ['go', 'goes', 'going'], correct: 1,
    explanation: 'Geniş zamanda üçüncü tekil şahısla fiil “-s” alır: She goes to school every day.'
  }
};

const yil = document.getElementById('yil');
if (yil) yil.textContent = new Date().getFullYear();

const demo = document.getElementById('demo');
if (demo) {
  const form = document.getElementById('exercise-form');
  const stage = document.getElementById('exercise-stage');
  const feedback = document.getElementById('exercise-feedback');
  const check = document.getElementById('check-answer');
  const reset = document.getElementById('reset-answer');
  const picker = demo.querySelector('.exam-picker');
  const tabs = [...demo.querySelectorAll('.exercise-tab')];
  let exam = 'yks';
  let type = 'choice';
  let answered = false;

  const activities = {
    choice: { subject: 'YKS · Matematik', text: 'f(x) = 2x + 3 ise f(2) kaçtır?', answers: ['5', '7', '9'], correct: 1, explanation: 'x yerine 2 yazılır: 2 × 2 + 3 = 7.' },
    blank: { subject: 'LGS · Türkçe', text: 'Türkiye’nin başkenti _____.', words: ['Ankara', 'İstanbul', 'İzmir'], correct: 'Ankara', explanation: 'Türkiye’nin başkenti Ankara’dır.' },
    matching: { subject: 'KPSS · Tarih', text: 'Kavramları doğru açıklamayla eşleştir.', pairs: [['TBMM', '23 Nisan 1920'], ['Cumhuriyet', '29 Ekim 1923'], ['Saltanat', '1 Kasım 1922']], explanation: 'TBMM 23 Nisan 1920’de açıldı; Cumhuriyet 29 Ekim 1923’te ilan edildi; saltanat 1 Kasım 1922’de kaldırıldı.' },
    timeline: { subject: 'YKS · Tarih', text: 'Olayları eskiden yeniye sırala.', items: ['TBMM’nin Açılması', 'Malazgirt Savaşı', 'İstanbul’un Fethi'], correct: ['Malazgirt Savaşı', 'İstanbul’un Fethi', 'TBMM’nin Açılması'], explanation: '1071 → 1453 → 1920.' },
    number: { subject: 'ALES · Sayısal', text: 'Bir kitap 240 sayfa. Her gün 30 sayfa okursan kaç günde bitirirsin?', answer: '8', explanation: '240 ÷ 30 = 8 gün.' },
    sentence: { subject: 'YDS/YÖKDİL · İngilizce', text: 'Kelimeleri doğru cümleye dönüştür.', words: ['She', 'goes', 'to', 'school', 'every', 'day.'], correct: 'She goes to school every day.', explanation: 'Geniş zamanda üçüncü tekil şahısla “goes” kullanılır.' },
    map: { subject: 'LGS · Coğrafya', text: 'Başkent Ankara hangi bölgemizdedir?', regions: ['Marmara', 'Ege', 'İç Anadolu', 'Akdeniz'], correct: 'İç Anadolu', explanation: 'Ankara, İç Anadolu Bölgesi’ndedir.' }
  };

  // Seçenekler kaynak sırasıyla verilirse cevap ele veriliyor; her açılışta karıştırılır.
  function shuffle(list) {
    const out = [...list];
    for (let i = out.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [out[i], out[j]] = [out[j], out[i]]; }
    return out;
  }
  function shuffledOrder(length) {
    const source = [...Array(length).keys()];
    if (length < 2) return source;
    let out = shuffle(source), guard = 0;
    while (out.every((value, index) => value === index) && guard++ < 16) out = shuffle(source);
    return out;
  }
  function shuffledList(list) { return shuffledOrder(list.length).map(index => list[index]); }

  function makeButton(label, className = 'choice-button') {
    const button = document.createElement('button');
    button.type = 'button'; button.className = className; button.textContent = label;
    return button;
  }
  function setQuestionText(activity) {
    const title = document.createElement('h3');
    title.className = 'activity-question'; title.textContent = activity.text;
    stage.replaceChildren(title);
  }
  function renderActivity() {
    answered = false;
    const activity = type === 'choice' ? questions[exam] : activities[type];
    document.getElementById('question-subject').textContent = activity.subject;
    document.getElementById('question-level').textContent = 'Başlangıç düzeyinde örnek';
    feedback.textContent = ''; feedback.className = 'feedback'; check.hidden = false; reset.hidden = true;
    form.querySelector('.exercise-hint').textContent = 'Etkinliği tamamla, ardından kontrol et.';
    setQuestionText(activity);
    if (type === 'choice') {
      const group = document.createElement('div'); group.className = 'answer-options'; group.setAttribute('role', 'radiogroup'); group.setAttribute('aria-label', 'Yanıt seçenekleri');
      activity.answers.forEach((answer, index) => { const label = document.createElement('label'); label.className = 'answer'; const input = document.createElement('input'); input.type = 'radio'; input.name = 'answer'; input.value = String(index); const span = document.createElement('span'); span.textContent = answer; label.append(input, span); group.append(label); });
      stage.append(group);
    } else if (type === 'blank') {
      const row = document.createElement('div'); row.className = 'blank-builder';
      const slot = document.createElement('button'); slot.type = 'button'; slot.className = 'drop-slot'; slot.dataset.answer = ''; slot.textContent = 'kelimeyi buraya bırak'; slot.setAttribute('aria-label', 'Boşluk için kelime seç'); row.append(slot);
      const bank = document.createElement('div'); bank.className = 'word-bank'; shuffledList(activity.words).forEach(word => { const chip = makeButton(word, 'word-chip'); chip.draggable = true; chip.dataset.word = word; bank.append(chip); }); row.append(bank); stage.append(row);
      bank.addEventListener('click', e => { if (e.target.matches('.word-chip')) { slot.dataset.answer = e.target.dataset.word; slot.textContent = e.target.dataset.word; slot.classList.add('has-word'); } });
      bank.addEventListener('dragstart', e => { if (e.target.matches('.word-chip')) e.dataTransfer.setData('text/plain', e.target.dataset.word); });
      slot.addEventListener('dragover', e => e.preventDefault()); slot.addEventListener('drop', e => { e.preventDefault(); slot.dataset.answer = e.dataTransfer.getData('text/plain'); slot.textContent = slot.dataset.answer; slot.classList.add('has-word'); });
    } else if (type === 'matching') {
      // Terimler ve tanımlar ayrı sütunlarda; tanım sırası karıştırılmazsa eşleşme satır satır okunuyor.
      const grid = document.createElement('div'); grid.className = 'matching-grid';
      const terms = document.createElement('div'); terms.className = 'match-column';
      const definitions = document.createElement('div'); definitions.className = 'match-column';
      activity.pairs.forEach(([term], index) => { const termButton = makeButton(term, 'match-term'); termButton.dataset.index = index; terms.append(termButton); });
      shuffledOrder(activity.pairs.length).forEach(index => { const definitionButton = makeButton(activity.pairs[index][1], 'match-definition'); definitionButton.dataset.index = index; definitions.append(definitionButton); });
      grid.append(terms, definitions); stage.append(grid);
      let selected = null; grid.addEventListener('click', e => { const button = e.target.closest('button'); if (!button || button.classList.contains('is-matched')) return; if (!selected) { selected = button; button.classList.add('is-selected'); return; } if (selected.classList.contains('match-term') && button.classList.contains('match-definition') || selected.classList.contains('match-definition') && button.classList.contains('match-term')) { if (selected.dataset.index === button.dataset.index) { selected.classList.remove('is-selected'); selected.classList.add('is-matched'); button.classList.add('is-matched'); } else { selected.classList.add('is-wrong'); button.classList.add('is-wrong'); setTimeout(() => { selected.classList.remove('is-wrong', 'is-selected'); button.classList.remove('is-wrong'); }, 450); } selected = null; } });
    } else if (type === 'timeline') {
      const list = document.createElement('ol'); list.className = 'timeline-list'; activity.items.forEach((item, index) => { const li = document.createElement('li'); li.draggable = true; li.dataset.item = item; const text = document.createElement('span'); text.textContent = item; const controls = document.createElement('span'); controls.className = 'move-controls'; const up = makeButton('↑', 'move-button'); const down = makeButton('↓', 'move-button'); up.setAttribute('aria-label', `${item} yukarı taşı`); down.setAttribute('aria-label', `${item} aşağı taşı`); controls.append(up, down); li.append(text, controls); list.append(li); }); stage.append(list);
      list.addEventListener('click', e => { const li = e.target.closest('li'); if (!li) return; if (e.target.textContent === '↑' && li.previousElementSibling) list.insertBefore(li, li.previousElementSibling); if (e.target.textContent === '↓' && li.nextElementSibling) list.insertBefore(li.nextElementSibling, li); });
      let dragged; list.addEventListener('dragstart', e => { dragged = e.target.closest('li'); }); list.addEventListener('dragover', e => { e.preventDefault(); const over = e.target.closest('li'); if (dragged && over && dragged !== over) { const box = over.getBoundingClientRect(); list.insertBefore(dragged, e.clientY < box.top + box.height / 2 ? over : over.nextSibling); } });
    } else if (type === 'number') {
      const input = document.createElement('input'); input.className = 'number-answer'; input.type = 'number'; input.inputMode = 'numeric'; input.min = '0'; input.placeholder = 'Cevabını yaz'; input.setAttribute('aria-label', 'Sayısal yanıt'); stage.append(input);
    } else if (type === 'sentence') {
      const builder = document.createElement('div'); builder.className = 'sentence-builder';
      const result = document.createElement('div'); result.className = 'sentence-result'; result.dataset.answer = ''; result.setAttribute('aria-live', 'polite');
      const bank = document.createElement('div'); bank.className = 'word-bank'; shuffledList(activity.words).forEach(word => { const chip = makeButton(word, 'word-chip'); chip.draggable = true; bank.append(chip); });
      builder.append(result, bank); stage.append(builder);
      // Seçilen kelimeler geri alınabilir olmalı; yoksa yanlış dokunuş çıkmaz sokak.
      const picked = [];
      const drawResult = () => {
        result.dataset.answer = picked.map(item => item.word).join(' ');
        result.classList.toggle('has-words', picked.length > 0);
        if (!picked.length) { result.textContent = 'Kelimeleri aşağıya taşı veya tıkla'; return; }
        result.replaceChildren(...picked.map((item, index) => {
          const word = makeButton(item.word, 'sentence-word');
          word.setAttribute('aria-label', `${item.word} kelimesini geri al`);
          word.addEventListener('click', () => { item.chip.disabled = false; picked.splice(index, 1); drawResult(); });
          return word;
        }));
      };
      const appendWord = word => { const chip = [...bank.querySelectorAll('.word-chip')].find(item => item.textContent === word && !item.disabled); if (!chip) return; chip.disabled = true; picked.push({ word, chip }); drawResult(); };
      drawResult();
      bank.addEventListener('click', e => { if (e.target.matches('.word-chip')) appendWord(e.target.textContent); }); bank.addEventListener('dragstart', e => { if (e.target.matches('.word-chip')) e.dataTransfer.setData('text/plain', e.target.textContent); }); result.addEventListener('dragover', e => e.preventDefault()); result.addEventListener('drop', e => { e.preventDefault(); const word = e.dataTransfer.getData('text/plain'); if (word) appendWord(word); });
    } else if (type === 'map') {
      const map = document.createElement('div'); map.className = 'map-grid'; activity.regions.forEach(region => { const button = makeButton(region, 'map-region'); button.dataset.region = region; map.append(button); }); stage.append(map); map.addEventListener('click', e => { const button = e.target.closest('.map-region'); if (!button) return; map.querySelectorAll('.map-region').forEach(item => item.classList.remove('is-selected')); button.classList.add('is-selected'); });
    }
  }

  function getAnswer() {
    if (type === 'choice') return stage.querySelector('input[name="answer"]:checked')?.value ?? '';
    if (type === 'blank') return stage.querySelector('.drop-slot')?.dataset.answer ?? '';
    if (type === 'matching') return [...stage.querySelectorAll('.match-term.is-matched')].length === activities.matching.pairs.length;
    if (type === 'timeline') return [...stage.querySelectorAll('.timeline-list li')].map(item => item.dataset.item);
    if (type === 'number') return stage.querySelector('.number-answer')?.value.trim() ?? '';
    if (type === 'sentence') return stage.querySelector('.sentence-result')?.dataset.answer ?? '';
    return stage.querySelector('.map-region.is-selected')?.dataset.region ?? '';
  }
  function isCorrect(answer) {
    const activity = type === 'choice' ? questions[exam] : activities[type];
    if (type === 'choice') return Number(answer) === activity.correct;
    if (type === 'timeline') return answer.join('|') === activity.correct.join('|');
    if (type === 'matching') return answer === true;
    if (type === 'number') return answer === activity.answer;
    return answer === activity.correct;
  }
  function explain() {
    const activity = type === 'choice' ? questions[exam] : activities[type];
    const answer = type === 'choice' ? activity.answers[activity.correct] : type === 'timeline' ? activity.correct.join(' → ') : type === 'sentence' ? activity.correct : type === 'matching' ? activity.pairs.map(pair => `${pair[0]} — ${pair[1]}`).join('; ') : activity.correct || activity.answer;
    return `Doğru yanıt: ${answer}. ${activity.explanation}`;
  }

  // Kontrol sonrası doğru yanıt görünür olmalı; aksi halde seçim rengi yanlış yanıtı doğru gibi gösteriyor.
  function markOutcome(correct) {
    const activity = type === 'choice' ? questions[exam] : activities[type];
    const outcome = correct ? 'is-correct' : 'is-wrong';
    if (type === 'choice') {
      stage.querySelectorAll('.answer').forEach((label, index) => {
        if (index === activity.correct) label.classList.add('answer--correct');
        else if (label.querySelector('input').checked) label.classList.add('answer--incorrect');
      });
      return;
    }
    if (type === 'map') {
      stage.querySelectorAll('.map-region').forEach(region => {
        if (region.dataset.region === activity.correct) region.classList.add('is-correct');
        else if (region.classList.contains('is-selected')) region.classList.add('is-wrong');
      });
      return;
    }
    const target = stage.querySelector({ blank: '.drop-slot', number: '.number-answer', sentence: '.sentence-result', timeline: '.timeline-list', matching: '.matching-grid' }[type]);
    if (target) target.classList.add(outcome);
  }

  picker.addEventListener('change', event => { if (event.target.name === 'exam') { exam = event.target.value; renderActivity(); } });
  // Sekme şeridi role="tablist" taşıyor; ok tuşları ve tek sekme durağı olmadan klavyeyle gezilemiyordu.
  stage.setAttribute('role', 'tabpanel');
  stage.setAttribute('tabindex', '-1');
  tabs.forEach(tab => { tab.id = `exercise-tab-${tab.dataset.type}`; tab.setAttribute('aria-controls', 'exercise-stage'); });
  function activateTab(tab, moveFocus) {
    type = tab.dataset.type;
    tabs.forEach(item => {
      const active = item === tab;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-selected', String(active));
      item.tabIndex = active ? 0 : -1;
    });
    stage.setAttribute('aria-labelledby', tab.id);
    if (moveFocus) { tab.focus(); tab.scrollIntoView({ block: 'nearest', inline: 'nearest' }); }
    renderActivity();
  }
  tabs.forEach(tab => tab.addEventListener('click', () => activateTab(tab, false)));
  demo.querySelector('.exercise-picker').addEventListener('keydown', event => {
    const step = { ArrowRight: 1, ArrowLeft: -1, Home: 'first', End: 'last' }[event.key];
    if (step === undefined) return;
    event.preventDefault();
    const current = tabs.findIndex(tab => tab.classList.contains('is-active'));
    const next = step === 'first' ? 0 : step === 'last' ? tabs.length - 1 : (current + step + tabs.length) % tabs.length;
    activateTab(tabs[next], true);
  });
  tabs.forEach(tab => { const active = tab.classList.contains('is-active'); tab.tabIndex = active ? 0 : -1; if (active) stage.setAttribute('aria-labelledby', tab.id); });
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (answered) return;
    const answer = getAnswer();
    const empty = answer === '' || answer === false || (Array.isArray(answer) && !answer.length);
    if (empty) {
      feedback.className = 'feedback feedback--warning';
      feedback.textContent = 'Kontrol etmeden önce etkinliği tamamla.';
      return;
    }
    answered = true;
    const correct = isCorrect(answer);
    feedback.className = `feedback ${correct ? 'feedback--correct' : 'feedback--explanation'}`;
    const title = document.createElement('strong');
    title.textContent = correct ? 'Doğru!' : 'Birlikte bakalım.';
    const explanation = document.createElement('p');
    explanation.textContent = explain();
    feedback.replaceChildren(title, explanation);
    markOutcome(correct);
    stage.querySelectorAll('input,button').forEach(input => { if (!input.closest('.exercise-tab')) input.disabled = true; });
    check.hidden = true;
    reset.hidden = false;
    form.querySelector('.exercise-hint').textContent = 'Başka bir sınavın örneğini de deneyebilirsin.';
    reset.focus({ preventScroll: true });
  });
  reset.addEventListener('click', () => {
    renderActivity();
    stage.querySelector('input,button')?.focus();
  });
  document.querySelectorAll('[data-exam-link]').forEach(link => {
    link.addEventListener('click', () => {
      exam = link.dataset.examLink;
      picker.querySelectorAll('input').forEach(input => { input.checked = input.value === exam; });
      renderActivity();
      picker.querySelector('input:checked')?.focus({ preventScroll: true });
    });
  });
  renderActivity();
  demo.hidden = false;
  document.getElementById('demo-fallback').hidden = true;
}
