import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // Setup API permissions for public role
    await setupPublicPermissions(strapi);
  },
};

async function setupPublicPermissions(strapi: Core.Strapi) {
  try {
    // Get the public role
    const publicRole = await strapi
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'public' } });

    if (!publicRole) {
      console.log('Public role not found');
      return;
    }

    // Define permissions to set for public role
    const permissionsToSet = [
      // Tour permissions
      { action: 'api::tour.tour.find', enabled: true },
      { action: 'api::tour.tour.findOne', enabled: true },
      { action: 'api::tour.tour.create', enabled: true }, // Temporary for testing
      
      // Point of Interest permissions  
      { action: 'api::point-of-interest.point-of-interest.find', enabled: true },
      { action: 'api::point-of-interest.point-of-interest.findOne', enabled: true },
      
      // Route uploader permissions (for testing)
      { action: 'api::route-uploader.route-uploader.uploadRoute', enabled: true },
    ];

    // Update permissions
    for (const permissionData of permissionsToSet) {
      const existingPermission = await strapi
        .query('plugin::users-permissions.permission')
        .findOne({
          where: {
            action: permissionData.action,
            role: publicRole.id,
          },
        });

      if (existingPermission) {
        await strapi
          .query('plugin::users-permissions.permission')
          .update({
            where: { id: existingPermission.id },
            data: { enabled: permissionData.enabled },
          });
      } else {
        await strapi
          .query('plugin::users-permissions.permission')
          .create({
            data: {
              action: permissionData.action,
              enabled: permissionData.enabled,
              role: publicRole.id,
            },
          });
      }
    }

    console.log('✅ Public API permissions configured successfully');
  } catch (error) {
    console.error('❌ Error setting up public permissions:', error);
  }
}
