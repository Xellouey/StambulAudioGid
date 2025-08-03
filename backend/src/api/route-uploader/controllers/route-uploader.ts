import * as xml2js from 'xml2js';

export default {
  async uploadRoute(ctx: any) {
    try {
      const { files } = ctx.request;
      const { tourId } = ctx.request.body;

      if (!files || !files.file) {
        return ctx.badRequest('No file uploaded');
      }

      if (!tourId) {
        return ctx.badRequest('Tour ID is required');
      }

      const file = Array.isArray(files.file) ? files.file[0] : files.file;
      
      // Validate file type
      const allowedExtensions = ['.kml', '.gpx', '.xml'];
      const fileExtension = file.originalFilename?.toLowerCase().split('.').pop();
      if (!allowedExtensions.includes(`.${fileExtension}`)) {
        return ctx.badRequest('Invalid file type. Only KML and GPX files are supported.');
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        return ctx.badRequest('File too large. Maximum size is 10MB.');
      }
      
      const fileContent = require('fs').readFileSync(file.filepath, 'utf8');
      
      // Validate XML structure
      if (!fileContent.trim().startsWith('<?xml') && !fileContent.trim().startsWith('<')) {
        return ctx.badRequest('Invalid XML file format.');
      }
      
      // Parse XML content
      const parser = new xml2js.Parser();
      const result = await parser.parseStringPromise(fileContent);
      
      let pointsOfInterest = [];
      
      // Parse KML format
      if (result.kml) {
        pointsOfInterest = await parseKML(result.kml, tourId, strapi);
      }
      // Parse GPX format  
      else if (result.gpx) {
        pointsOfInterest = await parseGPX(result.gpx, tourId, strapi);
      }
      else {
        return ctx.badRequest('Unsupported file format. Only KML and GPX are supported.');
      }

      ctx.body = {
        message: 'Route uploaded successfully',
        pointsCreated: pointsOfInterest.length,
        points: pointsOfInterest
      };

    } catch (error) {
      console.error('Error uploading route:', error);
      ctx.internalServerError('Failed to process route file');
    }
  }
};

async function parseKML(kml: any, tourId: string, strapi: any) {
  const points = [];
  
  try {
    const placemarks = kml.Document?.[0]?.Placemark || kml.Placemark || [];
    
    for (let i = 0; i < placemarks.length; i++) {
      const placemark = placemarks[i];
      const name = placemark.name?.[0] || `Point ${i + 1}`;
      const description = placemark.description?.[0] || '';
      
      // Extract coordinates
      const coordinates = placemark.Point?.[0]?.coordinates?.[0];
      if (!coordinates) continue;
      
      const [lng, lat, alt] = coordinates.split(',').map(Number);
      
      if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        console.warn(`Invalid coordinates for placemark: ${name} (lat: ${lat}, lng: ${lng})`);
        continue;
      }

      // Create POI in database
      const poi = await strapi.entityService.create('api::point-of-interest.point-of-interest', {
        data: {
          name,
          description,
          coordinates: { lat, lng },
          orderIndex: i + 1,
          isFree: i < 3, // First 3 POIs are free
          tour: tourId,
          publishedAt: new Date()
        }
      });
      
      points.push(poi);
    }
  } catch (error) {
    console.error('Error parsing KML:', error);
    throw error;
  }
  
  return points;
}

async function parseGPX(gpx: any, tourId: string, strapi: any) {
  const points = [];
  
  try {
    const waypoints = gpx.wpt || [];
    
    for (let i = 0; i < waypoints.length; i++) {
      const waypoint = waypoints[i];
      const name = waypoint.name?.[0] || `Waypoint ${i + 1}`;
      const description = waypoint.desc?.[0] || '';
      
      const lat = parseFloat(waypoint.$.lat);
      const lng = parseFloat(waypoint.$.lon);
      
      if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        console.warn(`Invalid coordinates for waypoint: ${name} (lat: ${lat}, lng: ${lng})`);
        continue;
      }

      // Create POI in database
      const poi = await strapi.entityService.create('api::point-of-interest.point-of-interest', {
        data: {
          name,
          description,
          coordinates: { lat, lng },
          orderIndex: i + 1,
          isFree: i < 3, // First 3 POIs are free
          tour: tourId,
          publishedAt: new Date()
        }
      });
      
      points.push(poi);
    }
  } catch (error) {
    console.error('Error parsing GPX:', error);
    throw error;
  }
  
  return points;
}