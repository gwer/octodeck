import homepage from '../src/pages/index.html';
import view from '../src/pages/v1/view/index.html';
import edit from '../src/pages/v1/edit/index.html';

Bun.serve({
  routes: {
    '/': () => Response.redirect('/octodeck/'),
    '/octodeck/': homepage,
    '/octodeck/v1/view/': view,
    '/octodeck/v1/edit/': edit,
  },

  development: true,
});
