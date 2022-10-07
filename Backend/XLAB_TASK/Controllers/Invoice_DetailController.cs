using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using XLAB_TASK.Models;

namespace XLAB_TASK.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Invoice_DetailController : ControllerBase
    {
        private readonly SalesDbContext _context;

        public Invoice_DetailController(SalesDbContext context)
        {
            _context = context;
        }

        //// GET: api/Invoice_Detail
        //[HttpGet]
        //public async Task<ActionResult<IEnumerable<Invoice_Detail>>> GetInvoice_Details()
        //{
        //    return await _context.Invoice_Details.ToListAsync();
        //}

        //// GET: api/Invoice_Detail/5
        //[HttpGet("{id}")]
        //public async Task<ActionResult<Invoice_Detail>> GetInvoice_Detail(string id)
        //{
        //    var invoice_Detail = await _context.Invoice_Details.FindAsync(id);

        //    if (invoice_Detail == null)
        //    {
        //        return NotFound();
        //    }

        //    return invoice_Detail;
        //}

        //// PUT: api/Invoice_Detail/5
        //// To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        //[HttpPut("{id}")]
        //public async Task<IActionResult> PutInvoice_Detail(string id, Invoice_Detail invoice_Detail)
        //{
        //    if (id != invoice_Detail.itemName)
        //    {
        //        return BadRequest();
        //    }

        //    _context.Entry(invoice_Detail).State = EntityState.Modified;

        //    try
        //    {
        //        await _context.SaveChangesAsync();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (!Invoice_DetailExists(id))
        //        {
        //            return NotFound();
        //        }
        //        else
        //        {
        //            throw;
        //        }
        //    }

        //    return NoContent();
        //}

        // POST: api/Invoice_Detail
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Invoice_Detail>> PostInvoice_Detail(Invoice_Detail invoice_Detail)
        {
            var item = await _context.Invoice_Details.FindAsync(invoice_Detail.itemName, (short) invoice_Detail.invoiceId);
            if (item != null)
            {
                return BadRequest();
            }

            _context.Invoice_Details.Add(invoice_Detail);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (Invoice_DetailExists(invoice_Detail.itemName))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return Ok();
        }

        // DELETE: api/Invoice_Detail/5
        [HttpDelete]
        public async Task<IActionResult> DeleteInvoice_Detail(string itemName, string invoiceId)
        {
            var invoice_Detail = await _context.Invoice_Details.FindAsync(itemName,short.Parse(invoiceId));
            if (invoice_Detail == null)
            {
                return NotFound();
            }

            _context.Invoice_Details.Remove(invoice_Detail);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool Invoice_DetailExists(string id)
        {
            return _context.Invoice_Details.Any(e => e.itemName == id);
        }
    }
}
