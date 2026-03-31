const currentUsers = Array.from({ length: 100000 }, (_, i) => ({ name: `User ${i}` }));
const term = 'User 999';
const field = 'name';

console.time('Before');
for (let i = 0; i < 100; i++) {
  const results = currentUsers.filter(u =>
    u[field]?.toString().toLowerCase().includes(term.toLowerCase())
  );
}
console.timeEnd('Before');

console.time('After');
const lowerTerm = term.toLowerCase();
for (let i = 0; i < 100; i++) {
  const results = currentUsers.filter(u =>
    u[field]?.toString().toLowerCase().includes(lowerTerm)
  );
}
console.timeEnd('After');
